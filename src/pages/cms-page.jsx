// Internal CMS — accessible at #/cms by team@copi.app
// CRUD for copi-source modules, lessons, blocks, quiz questions
import React from 'react';

function CmsPage({ user }) {
  const store = window.CopiStore;
  const [, rerender] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => store.subscribe(rerender), []);

  const th = window.THEME || {}, ty = window.TYPOGRAPHY || {}, sh = window.SHADOW || {};

  const [activeModuleId, setActiveModuleId] = React.useState(null);
  const [activeLessonId, setActiveLessonId] = React.useState(null);
  const [view, setView] = React.useState('modules'); // 'modules' | 'lessons' | 'blocks' | 'quiz'
  const [toast, setToast] = React.useState(null);

  // New module form
  const [newModTitle, setNewModTitle] = React.useState('');
  const [newModType,  setNewModType]  = React.useState('learning_track');

  // New lesson form
  const [newLessonTitle, setNewLessonTitle] = React.useState('');
  const [newLessonMin,   setNewLessonMin]   = React.useState(8);

  // New block form
  const [newBlockType, setNewBlockType] = React.useState('read');
  const [newBlockData, setNewBlockData] = React.useState('');

  // New quiz question form
  const [newQ,      setNewQ]      = React.useState('');
  const [newOpts,   setNewOpts]   = React.useState(['','','','']);
  const [newAnswer, setNewAnswer] = React.useState(0);
  const [newWhy,    setNewWhy]    = React.useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // Only copi-source modules visible
  const copiModules = Object.values(store.raw().modules || {}).filter((m) => m.source === 'copi');
  const activeModule = activeModuleId ? store.getModule(activeModuleId) : null;
  const lessons = activeLessonId === undefined ? [] : activeModuleId ? store.getLessonsForModule(activeModuleId) : [];
  const activeLesson = activeLessonId ? store.getLesson(activeLessonId) : null;
  const blocks = activeLesson ? (activeLesson.blockIds || []).map((id) => store.raw().blocks[id]).filter(Boolean) : [];

  const handleCreateModule = () => {
    if (!newModTitle.trim()) return;
    const mod = store.createModule({ cafeId: null, source: 'copi', type: newModType, title: newModTitle.trim(), roles: ['barista','host','manager'] });
    store.publishModule(mod.id);
    setNewModTitle('');
    showToast('Module created.');
  };

  const handleCreateLesson = () => {
    if (!newLessonTitle.trim() || !activeModuleId) return;
    const lesson = store.createLesson(activeModuleId, { title: newLessonTitle.trim(), minutes: parseInt(newLessonMin) || 8 });
    setNewLessonTitle('');
    setActiveLessonId(lesson.id);
    setView('blocks');
    showToast('Lesson created.');
  };

  const handleAddBlock = () => {
    if (!activeLessonId) return;
    let data;
    try { data = JSON.parse(newBlockData); } catch (_) { showToast('Block data must be valid JSON.'); return; }
    store.createBlock(activeLessonId, { type: newBlockType, data });
    setNewBlockData('');
    showToast('Block added.');
  };

  const handleAddQuestion = () => {
    if (!newQ.trim() || !activeLessonId) return;
    store.addQuizQuestion(activeLessonId, { q: newQ.trim(), options: newOpts.filter(o => o.trim()), answer: newAnswer, why: newWhy.trim() });
    setNewQ(''); setNewOpts(['','','','']); setNewAnswer(0); setNewWhy('');
    showToast('Question added.');
  };

  const blockTemplates = {
    read: '{"paragraphs": ["First paragraph.", "Second paragraph."]}',
    flashcard: '{"cards": [{"front": "Term or question", "back": "Definition or answer"}]}',
    drag_and_drop: '{"mode": "match", "prompt": "Match each term to its definition.", "pairs": [{"term": "Term A", "definition": "Definition A"}]}',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1F1B14', color: '#EFE9DA' }}>
      {/* Header */}
      <div style={{ background: '#2E3B2F', borderBottom: '1px solid #44704B55', padding: '0 24px', display: 'flex', alignItems: 'center', height: 52, gap: 12 }}>
        <span style={{ ...ty.displayItalic, fontSize: 20, color: '#C49455' }}>Copi.</span>
        <span style={{ ...ty.eyebrow, color: '#44704B', marginLeft: 4 }}>Internal CMS</span>
        <div style={{ flex: 1 }} />
        <span style={{ ...ty.caption, color: '#6E675A' }}>{user?.name || 'Copi Team'}</span>
        <button data-app-action="logout" style={{ ...ty.label, padding: '4px 12px', borderRadius: 999, background: '#2E3B2F', border: '1px solid #44704B55', color: '#6E675A', cursor: 'pointer' }}>Log out</button>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Sidebar */}
        <div style={{ background: '#2A2520', borderRadius: th.card, border: '1px solid #44704B33', padding: 16 }}>
          <p style={{ ...ty.eyebrow, color: '#44704B', marginBottom: 12 }}>Modules</p>
          {copiModules.map((mod) => (
            <div key={mod.id}
              onClick={() => { setActiveModuleId(mod.id); setActiveLessonId(null); setView('lessons'); }}
              style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 4,
                background: activeModuleId === mod.id ? '#44704B22' : 'transparent',
                border: `1px solid ${activeModuleId === mod.id ? '#44704B66' : 'transparent'}` }}>
              <p style={{ ...ty.bodySmall, color: activeModuleId === mod.id ? '#C49455' : '#EFE9DA', margin: '0 0 2px' }}>{mod.title}</p>
              <p style={{ ...ty.caption, color: '#6E675A', margin: 0 }}>{mod.type.replace('_', ' ')} · {mod.lessonIds?.length || 0} lessons</p>
            </div>
          ))}

          {/* New module */}
          <div style={{ marginTop: 16, borderTop: '1px solid #44704B33', paddingTop: 12 }}>
            <p style={{ ...ty.eyebrow, color: '#6E675A', marginBottom: 8 }}>New module</p>
            <input value={newModTitle} onChange={(e) => setNewModTitle(e.target.value)} placeholder="Module title"
              style={{ width: '100%', ...ty.bodySmall, padding: '7px 10px', background: '#1F1B14', border: '1px solid #44704B55', borderRadius: 8, color: '#EFE9DA', outline: 'none', marginBottom: 6, boxSizing: 'border-box' }} />
            <select value={newModType} onChange={(e) => setNewModType(e.target.value)}
              style={{ width: '100%', ...ty.caption, padding: '7px 10px', background: '#1F1B14', border: '1px solid #44704B55', borderRadius: 8, color: '#EFE9DA', marginBottom: 6, cursor: 'pointer' }}>
              <option value="learning_track">Learning track</option>
              <option value="onboarding">Onboarding</option>
            </select>
            <button onClick={handleCreateModule} style={{ width: '100%', ...ty.label, padding: '7px', background: '#44704B', border: 'none', borderRadius: 8, color: '#EFE9DA', cursor: 'pointer' }}>+ Create module</button>
          </div>
        </div>

        {/* Main panel */}
        <div>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
            <button onClick={() => { setView('modules'); setActiveModuleId(null); setActiveLessonId(null); }}
              style={{ ...ty.caption, color: '#44704B', background: 'none', border: 'none', cursor: 'pointer' }}>Modules</button>
            {activeModule && <>
              <span style={{ ...ty.caption, color: '#6E675A' }}>/</span>
              <button onClick={() => { setView('lessons'); setActiveLessonId(null); }}
                style={{ ...ty.caption, color: view === 'lessons' ? '#C49455' : '#44704B', background: 'none', border: 'none', cursor: 'pointer' }}>{activeModule.title}</button>
            </>}
            {activeLesson && <>
              <span style={{ ...ty.caption, color: '#6E675A' }}>/</span>
              <button onClick={() => setView('blocks')}
                style={{ ...ty.caption, color: view === 'blocks' ? '#C49455' : '#44704B', background: 'none', border: 'none', cursor: 'pointer' }}>{activeLesson.title}</button>
            </>}
          </div>

          {/* Lessons list */}
          {view === 'lessons' && activeModule && (
            <div>
              <h2 style={{ ...ty.h3, color: '#EFE9DA', marginBottom: 20 }}>{activeModule.title}</h2>
              {(store.getLessonsForModule(activeModuleId) || []).map((lesson, i) => (
                <div key={lesson.id}
                  style={{ padding: '12px 16px', background: '#2A2520', borderRadius: 10, border: '1px solid #44704B33', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ ...ty.body, color: '#EFE9DA', margin: '0 0 2px' }}>{lesson.title}</p>
                    <p style={{ ...ty.caption, color: '#6E675A', margin: 0 }}>{(lesson.blockIds||[]).length} blocks · {(lesson.quiz||[]).length} quiz questions · {lesson.minutes} min</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setActiveLessonId(lesson.id); setView('blocks'); }}
                      style={{ ...ty.label, padding: '5px 12px', borderRadius: 8, background: '#44704B33', border: '1px solid #44704B55', color: '#C49455', cursor: 'pointer' }}>Edit blocks</button>
                    <button onClick={() => { setActiveLessonId(lesson.id); setView('quiz'); }}
                      style={{ ...ty.label, padding: '5px 12px', borderRadius: 8, background: '#44704B33', border: '1px solid #44704B55', color: '#C49455', cursor: 'pointer' }}>Edit quiz</button>
                    <button onClick={() => { store.deleteLesson(lesson.id); showToast('Lesson deleted.'); }}
                      style={{ ...ty.label, padding: '5px 12px', borderRadius: 8, background: 'transparent', border: '1px solid #7A2B1F55', color: '#7A2B1F', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}

              {/* New lesson */}
              <div style={{ padding: '16px', background: '#2A2520', borderRadius: 10, border: '1px solid #44704B33', marginTop: 12 }}>
                <p style={{ ...ty.eyebrow, color: '#6E675A', marginBottom: 10 }}>Add lesson</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)} placeholder="Lesson title"
                    style={{ flex: 1, ...ty.body, padding: '8px 12px', background: '#1F1B14', border: '1px solid #44704B55', borderRadius: 8, color: '#EFE9DA', outline: 'none' }} />
                  <input type="number" value={newLessonMin} onChange={(e) => setNewLessonMin(e.target.value)} placeholder="Minutes"
                    style={{ width: 80, ...ty.body, padding: '8px 12px', background: '#1F1B14', border: '1px solid #44704B55', borderRadius: 8, color: '#EFE9DA', outline: 'none' }} />
                  <button onClick={handleCreateLesson} style={{ ...ty.button, padding: '8px 18px', background: '#44704B', border: 'none', borderRadius: 8, color: '#EFE9DA', cursor: 'pointer' }}>Add</button>
                </div>
              </div>
            </div>
          )}

          {/* Blocks editor */}
          {view === 'blocks' && activeLesson && (
            <div>
              <h2 style={{ ...ty.h3, color: '#EFE9DA', marginBottom: 8 }}>{activeLesson.title} — Blocks</h2>
              <p style={{ ...ty.caption, color: '#6E675A', marginBottom: 20 }}>Blocks are shown in order before the quiz.</p>

              {blocks.map((block, i) => (
                <div key={block.id} style={{ padding: '12px 16px', background: '#2A2520', borderRadius: 10, border: '1px solid #44704B33', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ ...ty.label, color: '#44704B', background: '#44704B22', padding: '2px 8px', borderRadius: 999, display: 'inline-block', marginBottom: 8 }}>{block.type}</span>
                      <pre style={{ ...ty.mono, color: '#EFE9DA', background: '#1F1B14', padding: 10, borderRadius: 8, overflow: 'auto', fontSize: 12, margin: 0 }}>{JSON.stringify(block.data, null, 2)}</pre>
                    </div>
                    <button onClick={() => { store.deleteBlock(block.id); showToast('Block removed.'); }}
                      style={{ ...ty.label, padding: '4px 10px', background: 'transparent', border: '1px solid #7A2B1F55', color: '#7A2B1F', borderRadius: 8, cursor: 'pointer', flexShrink: 0 }}>Remove</button>
                  </div>
                </div>
              ))}

              <div style={{ padding: '16px', background: '#2A2520', borderRadius: 10, border: '1px solid #44704B33', marginTop: 12 }}>
                <p style={{ ...ty.eyebrow, color: '#6E675A', marginBottom: 10 }}>Add block</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  {['read','flashcard','drag_and_drop'].map((t) => (
                    <button key={t} onClick={() => { setNewBlockType(t); setNewBlockData(blockTemplates[t]); }}
                      style={{ ...ty.label, padding: '5px 12px', borderRadius: 8, background: newBlockType === t ? '#44704B' : '#1F1B14', border: '1px solid #44704B55', color: newBlockType === t ? '#EFE9DA' : '#6E675A', cursor: 'pointer' }}>{t}</button>
                  ))}
                </div>
                <textarea value={newBlockData} onChange={(e) => setNewBlockData(e.target.value)} rows={8}
                  style={{ width: '100%', ...ty.mono, fontSize: 12, padding: '10px', background: '#1F1B14', border: '1px solid #44704B55', borderRadius: 8, color: '#EFE9DA', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 8 }} />
                <button onClick={handleAddBlock} style={{ ...ty.button, padding: '8px 20px', background: '#44704B', border: 'none', borderRadius: 8, color: '#EFE9DA', cursor: 'pointer' }}>Add block</button>
              </div>
            </div>
          )}

          {/* Quiz editor */}
          {view === 'quiz' && activeLesson && (
            <div>
              <h2 style={{ ...ty.h3, color: '#EFE9DA', marginBottom: 8 }}>{activeLesson.title} — Quiz</h2>
              <p style={{ ...ty.caption, color: '#6E675A', marginBottom: 20 }}>Pass mark: {Math.round((activeLesson.passMark || 0.6) * 100)}%</p>

              {(activeLesson.quiz || []).map((q, i) => (
                <div key={i} style={{ padding: '14px 16px', background: '#2A2520', borderRadius: 10, border: '1px solid #44704B33', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ ...ty.body, color: '#EFE9DA', margin: '0 0 8px' }}>{i + 1}. {q.q}</p>
                      {q.options.map((opt, j) => (
                        <p key={j} style={{ ...ty.caption, color: j === q.answer ? '#44704B' : '#6E675A', margin: '2px 0' }}>
                          {j === q.answer ? '✓ ' : '  '}{opt}
                        </p>
                      ))}
                      {q.why && <p style={{ ...ty.caption, color: '#C49455', margin: '6px 0 0', fontStyle: 'italic' }}>Why: {q.why}</p>}
                    </div>
                    <button onClick={() => { store.removeQuizQuestion(activeLesson.id, i); showToast('Question removed.'); }}
                      style={{ ...ty.label, padding: '4px 10px', background: 'transparent', border: '1px solid #7A2B1F55', color: '#7A2B1F', borderRadius: 8, cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-start' }}>Remove</button>
                  </div>
                </div>
              ))}

              {/* New question form */}
              <div style={{ padding: '16px', background: '#2A2520', borderRadius: 10, border: '1px solid #44704B33', marginTop: 12 }}>
                <p style={{ ...ty.eyebrow, color: '#6E675A', marginBottom: 10 }}>Add question</p>
                <input value={newQ} onChange={(e) => setNewQ(e.target.value)} placeholder="Question text"
                  style={{ width: '100%', ...ty.body, padding: '8px 12px', background: '#1F1B14', border: '1px solid #44704B55', borderRadius: 8, color: '#EFE9DA', outline: 'none', marginBottom: 8, boxSizing: 'border-box' }} />
                {newOpts.map((opt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                    <button onClick={() => setNewAnswer(i)}
                      style={{ width: 22, height: 22, borderRadius: 99, background: newAnswer === i ? '#44704B' : 'transparent', border: `2px solid ${newAnswer === i ? '#44704B' : '#44704B55'}`, cursor: 'pointer', flexShrink: 0 }} />
                    <input value={opt} onChange={(e) => { const o = [...newOpts]; o[i] = e.target.value; setNewOpts(o); }} placeholder={`Option ${i + 1}`}
                      style={{ flex: 1, ...ty.bodySmall, padding: '6px 10px', background: '#1F1B14', border: '1px solid #44704B55', borderRadius: 8, color: '#EFE9DA', outline: 'none' }} />
                  </div>
                ))}
                <input value={newWhy} onChange={(e) => setNewWhy(e.target.value)} placeholder="Explanation (shown after answer)"
                  style={{ width: '100%', ...ty.bodySmall, padding: '8px 12px', background: '#1F1B14', border: '1px solid #44704B55', borderRadius: 8, color: '#EFE9DA', outline: 'none', marginTop: 6, marginBottom: 10, boxSizing: 'border-box' }} />
                <button onClick={handleAddQuestion} style={{ ...ty.button, padding: '8px 20px', background: '#44704B', border: 'none', borderRadius: 8, color: '#EFE9DA', cursor: 'pointer' }}>Add question</button>
              </div>
            </div>
          )}

          {!activeModuleId && (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6E675A' }}>
              <p style={{ ...ty.h4, color: '#EFE9DA', margin: '0 0 8px' }}>Select a module to start editing.</p>
              <p style={{ ...ty.body }}>Or create a new module using the panel on the left.</p>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#44704B', color: '#EFE9DA', padding: '10px 20px', borderRadius: 999, ...ty.bodySmall, maxWidth: 360 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

window.CmsPage = CmsPage;
