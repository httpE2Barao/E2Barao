import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Get all constraints on skills table
    const { rows: constraints } = await sql`
      SELECT c.oid, c.conname, pg_get_constraintdef(c.oid, true) as definition
      FROM pg_constraint c
      WHERE c.conrelid = 'skills'::regclass AND c.contype = 'c'
    `;
    
    console.log('Found CHECK constraints:', constraints);

    // Drop each CHECK constraint individually
    for (const constraint of constraints) {
      try {
        const dropQuery = `ALTER TABLE skills DROP CONSTRAINT ${constraint.conname}`;
        await sql.query(dropQuery);
        console.log(`Successfully dropped constraint: ${constraint.conname}`);
      } catch (dropError: any) {
        console.error(`Failed to drop constraint ${constraint.conname}:`, dropError.message);
      }
    }

    // Verify constraints are dropped
    const { rows: remainingConstraints } = await sql`
      SELECT conname FROM pg_constraint 
      WHERE conrelid = 'skills'::regclass AND contype = 'c'
    `;
    
    if (remainingConstraints.length > 0) {
      return NextResponse.json({ 
        message: 'Some constraints could not be dropped',
        remaining: remainingConstraints.map(c => c.conname)
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'All CHECK constraints removed from skills table',
      dropped: constraints.map(c => c.conname)
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
