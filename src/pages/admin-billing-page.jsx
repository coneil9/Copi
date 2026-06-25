// ═════════════════════════════════════════════════════════
// BILLING PAGE — Current plan, payment method, invoice history.
// Styled consistent with the Analytics page: Playpen Sans headings,
// Hanken Grotesk body, palette tokens only.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell, CopiModal } from './admin-shell.jsx';
import { PageHeader, Card } from './admin-ui.jsx';

const INVOICES = [
  { id: 'INV-2026-006', date: 'Jun 1, 2026',  description: 'Copi Pro — monthly subscription', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2026-005', date: 'May 1, 2026',  description: 'Copi Pro — monthly subscription', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2026-004', date: 'Apr 1, 2026',  description: 'Copi Pro — monthly subscription', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2026-003', date: 'Mar 1, 2026',  description: 'Copi Pro — monthly subscription', amount: '$49.00', status: 'Paid' }
];

function PaidPill() {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: 999,
      background: 'var(--glade-green)',
      color: 'var(--white)',
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.04em'
    }}>
      Paid
    </span>
  );
}

function AdminBillingPage({ user = {} }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;
  const [modal, setModal] = React.useState(null);

  return (
    <AdminShell current="billing" user={user} cafe={cafe}>
      <PageHeader
        eyebrow="OWNER · BILLING"
        title="Billing & plan"
        subtitle="Manage your subscription, payment method, and download past invoices."
      />


      {/* Top row: current plan + payment method side by side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 18,
        marginBottom: 32
      }}>
        {/* Current plan */}
        <section style={{
          background: 'var(--white)',
          border: '1px solid var(--pearl-bush)',
          borderRadius: 14,
          padding: 26,
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--roman-coffee)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 6
              }}>
                CURRENT PLAN
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--graphite)',
                letterSpacing: '-0.005em'
              }}>
                Copi Pro
              </div>
            </div>
            <span style={{
              padding: '4px 12px',
              borderRadius: 999,
              background: 'rgba(111, 139, 95, 0.18)',
              color: 'var(--glade-green-deep)',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              Active
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 800,
              fontSize: 38,
              color: 'var(--glade-green-deep)',
              lineHeight: 1
            }}>$49</span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'var(--roman-coffee)'
            }}>/ month</span>
          </div>

          <div style={{
            display: 'flex',
            gap: 24,
            paddingTop: 8,
            borderTop: '1px dashed var(--heathered-gray)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--graphite)'
          }}>
            <div>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--roman-coffee)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 4
              }}>Next billing</div>
              Jul 1, 2026
            </div>
            <div>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--roman-coffee)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 4
              }}>Seats included</div>
              Up to 25 teammates
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              onClick={() => setModal({
                title: 'Manage your plan',
                body: 'Upgrade to Copi Studio for unlimited seats and custom curriculum review by our team.',
                accent: 'var(--glade-green-deep)'
              })}
              style={{
                padding: '10px 20px',
                borderRadius: 999,
                background: 'var(--glade-green-deep)',
                color: 'var(--white)',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Manage plan
            </button>
            <button
              onClick={() => setModal({
                title: 'Cancel subscription',
                body: 'We hate to see you go. Your account will stay active until Jul 1, 2026 and won\'t renew.',
                accent: 'var(--danger)'
              })}
              style={{
                padding: '10px 20px',
                borderRadius: 999,
                background: 'transparent',
                color: 'var(--roman-coffee)',
                border: '1.5px solid var(--heathered-gray)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </section>

        {/* Payment method */}
        <section style={{
          background: 'var(--white)',
          border: '1px solid var(--pearl-bush)',
          borderRadius: 14,
          padding: 26,
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--roman-coffee)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}>
            PAYMENT METHOD
          </div>

          <div style={{
            background: 'var(--white)',
            border: '1px solid var(--pearl-bush)',
            borderRadius: 12,
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>
            <div style={{
              width: 48,
              height: 32,
              borderRadius: 6,
              background: 'var(--glade-green-deep)',
              color: 'var(--ripe-lemon)',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: '0.04em'
            }}>
              VISA
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--graphite)',
                fontVariantNumeric: 'tabular-nums'
              }}>
                Visa •••• 4242
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--roman-coffee)'
              }}>
                Expires 09 / 28 · Brian Turko
              </div>
            </div>
          </div>

          <button
            onClick={() => setModal({
              title: 'Update card',
              body: 'You\'ll be taken to our secure payment partner to update your card on file.',
              accent: 'var(--glade-green-deep)'
            })}
            style={{
              alignSelf: 'flex-start',
              padding: '10px 20px',
              borderRadius: 999,
              background: 'transparent',
              color: 'var(--glade-green-deep)',
              border: '1.5px solid var(--glade-green-deep)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Update card
          </button>
        </section>
      </div>

      {/* Invoice history */}
      <section>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--roman-coffee)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 10
        }}>
          INVOICE HISTORY
        </div>

        <div style={{
          background: 'var(--white)',
          border: '1px solid var(--pearl-bush)',
          borderRadius: 14,
          overflow: 'hidden'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-body)'
          }}>
            <thead>
              <tr style={{ background: 'var(--pearl-bush)' }}>
                {['Date', 'Description', 'Amount', 'Status', ''].map((h) => (
                  <th key={h || 'dl'} style={{
                    textAlign: 'left',
                    padding: '14px 18px',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--roman-coffee)',
                    borderBottom: '1px solid var(--heathered-gray)'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr key={inv.id} style={{
                  borderBottom: i === INVOICES.length - 1 ? 'none' : '1px solid rgba(181, 163, 139, 0.4)',
                  background: i % 2 === 0 ? 'var(--alabaster)' : 'rgba(232, 221, 200, 0.4)'
                }}>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--graphite)' }}>
                    {inv.date}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--graphite)' }}>
                    <div style={{ fontWeight: 600 }}>{inv.description}</div>
                    <div style={{ fontSize: 11, color: 'var(--roman-coffee)' }}>{inv.id}</div>
                  </td>
                  <td style={{
                    padding: '14px 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--graphite)',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {inv.amount}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <PaidPill />
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      onClick={() => setModal({
                        title: `Download ${inv.id}`,
                        body: `Your PDF receipt will start downloading in a moment.`,
                        accent: 'var(--glade-green-deep)'
                      })}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--glade-green-deep)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Download ↓
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CopiModal
        title={modal?.title}
        body={modal?.body}
        accent={modal?.accent}
        onClose={() => setModal(null)}
      />
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  window.AdminBillingPage = AdminBillingPage;
}

export default AdminBillingPage;
