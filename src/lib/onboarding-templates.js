// Standard milestone templates used by the AI hybridizer.
// When a cafe uploads docs, the AI maps their content onto these
// templates and flags gaps where nothing was uploaded.

export const STANDARD_MILESTONES = {
  barista: [
    { title: 'Cafe culture and expectations', desc: 'Review house rules, scheduling policies, communication norms, and team values with your manager.' },
    { title: 'Equipment walk-through', desc: 'Hands-on guided tour of all equipment: espresso machine, grinder, brew bar, refrigeration, and POS system.' },
    { title: 'First espresso pull', desc: 'Pull and taste an espresso shot under manager supervision. Dial in grind and dose to spec.' },
    { title: 'Milk steaming to standard', desc: 'Steam microfoam to correct texture and temperature for flat whites, lattes, and cappuccinos.' },
    { title: 'Build all house drinks from memory', desc: 'Prepare the full house menu without reference. Assessed and signed off by manager.' },
    { title: 'Opening procedures', desc: 'Complete full opening sequence: equipment warm-up, stock check, calibration, floor prep.' },
    { title: 'Closing procedures', desc: 'Complete full closing sequence: cleaning, shutdowns, waste logs, security checks.' },
    { title: 'Health & safety sign-off', desc: 'Review allergen matrix, cleaning schedule, food handling rules, and emergency procedures.' },
    { title: 'Cash handling and POS', desc: 'Process sales, voids, and refunds. Understand till reconciliation and float procedures.' },
  ],
  host: [
    { title: 'Cafe culture and expectations', desc: 'Review house rules, scheduling policies, communication norms, and team values.' },
    { title: 'Floor walk-through', desc: 'Learn seating layout, service flow, and table management procedures.' },
    { title: 'Menu knowledge check', desc: 'Know all menu items, allergens, and substitution options. Verbal assessment by manager.' },
    { title: 'Opening and closing procedures', desc: 'Complete opening or closing sequence for front-of-house.' },
    { title: 'Health & safety sign-off', desc: 'Review allergen matrix, food handling rules, and emergency procedures.' },
  ],
  manager: [
    { title: 'Shadow a full shift', desc: 'Observe a complete opening or closing shift with an experienced team member.' },
    { title: 'Run floor independently', desc: 'Manage a full shift solo. Owner or senior manager confirms readiness.' },
    { title: 'Complete scheduling module', desc: 'Build a one-week schedule using the cafe\'s template and rota rules.' },
    { title: 'Staff management tools walk-through', desc: 'Review Copi dashboard: assign modules, sign off milestones, view progress.' },
    { title: 'Incident and complaint handling', desc: 'Understand escalation procedures, complaint scripts, and incident reporting.' },
  ],
};

// Gap messages — shown when uploaded docs didn't cover a topic
export const GAP_MESSAGES = {
  'cafe culture': 'No culture or expectations document found. We\'ve included a standard placeholder — fill in your specific norms.',
  'equipment': 'No equipment training guide found. Add your specific machine models and calibration procedures.',
  'espresso': 'No espresso SOP found. We\'ve added a standard dial-in checklist — update with your house recipe.',
  'milk': 'No milk steaming guide found. Added a standard microfoam SOP.',
  'health': 'No health & safety policy found. Added a standard template — review with your local compliance requirements.',
  'opening': 'No opening procedure found. Added a standard checklist — update with your specific steps.',
  'closing': 'No closing procedure found. Added a standard checklist — update with your specific steps.',
};
