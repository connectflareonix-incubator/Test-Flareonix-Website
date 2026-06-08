import React from 'react';
import ProjectMedia from './ProjectMedia';
import ProjectDetails from './ProjectDetails';

const ProjectBlock = ({ p, idx }) => {
  const isRight = idx % 2 === 1;
  const photo = (p.photos || [])[0];
  return (
    <div className={`grid md:grid-cols-2 gap-8 items-center ${isRight ? 'md:[direction:rtl]' : ''}`} data-animate="fade-up">
      <div className="md:[direction:ltr]">
        <ProjectMedia photo={photo} title={p.title} />
      </div>
      <ProjectDetails
        title={p.title}
        status={p.status}
        description={p.description}
        outcomes={p.outcomes}
        client_partner_name={p.client_partner_name}
        testimonial_quote={p.testimonial_quote}
        tags={p.tags}
        timeline_start={p.timeline_start}
        timeline_end={p.timeline_end}
      />
    </div>
  );
};

export default ProjectBlock;
