import { supabase } from '../config/supabase.js';
import { sendLeadNotification, sendLeadConfirmation } from '../services/email.service.js';

export async function handleContact(req, res, next) {
  try {
    const { name, email, company, service, message, budget, sourcePage } = req.body;

    // Insert lead into Supabase (service_role bypasses RLS)
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        company: company || null,
        service: service || null,
        message,
        budget: budget || null,
        source_page: sourcePage || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: send both emails without blocking the 201 response
    Promise.all([sendLeadNotification(lead), sendLeadConfirmation(lead)]).catch((err) =>
      console.error('[email send]', err.message)
    );

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}
