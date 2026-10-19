import { examples } from './sample.js';

export function CommentBox({ draft, onDraftChange, onPublish, publishLabel }) {
  const current = examples.find((example) => example.value === draft);

  return (
    <div className="comment-box">
      <p className="hint">Escolha um exemplo pronto ou escreva o seu:</p>
      <div className="chips">
        {examples.map((example) => (
          <button
            key={example.id}
            type="button"
            className={example.value === draft ? 'chip active' : 'chip'}
            onClick={() => onDraftChange(example.value)}
          >
            {example.label}
          </button>
        ))}
      </div>
      <label className="field">
        <span>Comentário</span>
        <textarea
          rows={3}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
        />
      </label>
      {current && <p className="hint">{current.explain}</p>}
      <button type="button" className="probe-button" onClick={onPublish}>
        {publishLabel}
      </button>
    </div>
  );
}
