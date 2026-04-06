import { NextRequest, NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "e2barao@hotmail.com"

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
  } catch {
  }

  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }

    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Nome deve ter pelo menos 2 caracteres" },
        { status: 400 }
      )
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Mensagem deve ter pelo menos 10 caracteres" },
        { status: 400 }
      )
    }

    await sql`
      INSERT INTO contact_messages (name, email, message, created_at)
      VALUES (${name.trim()}, ${email.trim()}, ${message.trim()}, NOW())
    `

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: [CONTACT_EMAIL],
        subject: `Nova mensagem de ${name.trim()}`,
        html: `
          <h2>Nova mensagem do portfólio</h2>
          <p><strong>Nome:</strong> ${name.trim()}</p>
          <p><strong>Email:</strong> ${email.trim()}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message.trim()}</p>
        `,
      })
    }

    return NextResponse.json(
      { success: true, message: "Mensagem enviada com sucesso" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error saving contact message:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
