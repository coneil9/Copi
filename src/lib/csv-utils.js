// csv-utils.js — CSV import/export for staff upload

export function buildTemplateCsv() {
  const rows = [
    ['name', 'email', 'role', 'location'],
    ['Jane Kim', 'jane@yourcafe.com', 'barista', 'Downtown'],
    ['Marcus Bell', 'marcus@yourcafe.com', 'barista', 'Westside'],
    ['Elena Cruz', 'elena@yourcafe.com', 'manager', 'Downtown'],
  ];
  return rows.map((r) => r.join(',')).join('\n');
}

export function downloadCsv(content, filename = 'staff-template.csv') {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const VALID_ROLES = ['manager', 'barista', 'host'];

export function parseStaffCsv(csvText, locationsByName) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return { rows: [], errors: [{ row: 0, message: 'File is empty.' }] };

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const nameIdx     = headers.indexOf('name');
  const emailIdx    = headers.indexOf('email');
  const roleIdx     = headers.indexOf('role');
  const locationIdx = headers.indexOf('location');

  const missing = [];
  if (nameIdx < 0)     missing.push('name');
  if (emailIdx < 0)    missing.push('email');
  if (roleIdx < 0)     missing.push('role');
  if (locationIdx < 0) missing.push('location');
  if (missing.length) return { rows: [], errors: [{ row: 0, message: `Missing required columns: ${missing.join(', ')}` }] };

  const rows = [];
  const errors = [];
  const seenEmails = new Set();

  lines.slice(1).forEach((line, i) => {
    if (!line.trim()) return;
    const cells = line.split(',').map((c) => c.trim());
    const rowNum = i + 2; // 1-indexed, +1 for header
    const name     = cells[nameIdx]     || '';
    const email    = (cells[emailIdx]   || '').toLowerCase();
    const role     = (cells[roleIdx]    || '').toLowerCase();
    const location = cells[locationIdx] || '';

    if (!name)  errors.push({ row: rowNum, message: `Row ${rowNum}: name is required.` });
    if (!email || !email.includes('@')) errors.push({ row: rowNum, message: `Row ${rowNum}: invalid email "${email}".` });
    if (!VALID_ROLES.includes(role)) errors.push({ row: rowNum, message: `Row ${rowNum}: role must be one of ${VALID_ROLES.join(', ')} (got "${role}").` });

    const locationId = locationsByName[location.toLowerCase()];
    if (!locationId) errors.push({ row: rowNum, message: `Row ${rowNum}: location "${location}" not found.` });

    if (seenEmails.has(email)) {
      errors.push({ row: rowNum, message: `Row ${rowNum}: duplicate email "${email}".` });
    } else {
      seenEmails.add(email);
    }

    rows.push({ name, email, role, location, locationId: locationId || null, rowNum });
  });

  return { rows, errors };
}
