import React from 'react';
import RisingArrow from '@/components/decor/RisingArrow';

const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '');

const StatusBadge = ({ status }) => (
  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'}`}>
    {status}
  </span>
);

const TagsRow = ({ tags }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((t) => (
        <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-white/60">#{t}</span>
      ))}
    </div>
  );
};

const Outcomes = ({ text }) => {
  if (!text) return null;
  return (
    <div className="mt-4 p-3 rounded-lg bg-white/5">
      <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
        <RisingArrow size={16} /> Outcomes
      </div>
      <p className="text-sm text-white/80">{text}</p>
    </div>
  );
};

const ProjectDetails = (props) => {
  const title = props.title;
  const status = props.status;
  const description = props.description;
  const outcomes = props.outcomes;
  const client = props.client_partner_name;
  const quote = props.testimonial_quote;
  const tags = props.tags;
  const tStart = props.timeline_start;
  const tEnd = props.timeline_end;

  const timeline =
    (tStart ? fmt(tStart) : '') +
    (tEnd ? ` – ${fmt(tEnd)}` : status === 'Ongoing' ? ' – Ongoing' : '');

  return (
    <div className="md:[direction:ltr]">
      <StatusBadge status={status} />
      <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mt-2">{title}</h3>
      <div className="text-xs text-white/40 mt-1">{timeline}</div>
      <p className="text-white/70 mt-3">{description}</p>
      <Outcomes text={outcomes} />
      {client ? (
        <p className="text-sm text-white/50 mt-3">
          In collaboration with: <span className="text-white">{client}</span>
        </p>
      ) : null}
      {quote ? (
        <blockquote className="mt-4 pl-4 border-l-2 border-primary italic text-white/70 text-sm">
          &ldquo;{quote}&rdquo;
        </blockquote>
      ) : null}
      <TagsRow tags={tags} />
    </div>
  );
};

export default ProjectDetails;
