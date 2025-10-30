import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Espera { customer, doc_type, series, number, items: [{code, qty}] }
export async function POST(req) {
  const body = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase.rpc("create_sale", {
    p_customer: body.customer,
    p_doc_type: body.doc_type,
    p_doc_series: body.series,
    p_doc_number: body.number,
    p_items: body.items
  });

  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
  return NextResponse.json({ ok: true, sale_id: data });
}
