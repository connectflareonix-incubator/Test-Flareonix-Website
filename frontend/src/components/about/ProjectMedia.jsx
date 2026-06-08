import React from 'react';

const ProjectMedia = ({ photo, title }) => (
  <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-[#CC2200]/20 flex items-center justify-center">
    {photo
      ? <img src={photo} alt={title} className="w-full h-full object-cover" />
      : <span className="font-heading text-3xl font-black text-white/30 text-center px-4">{title}</span>}
  </div>
);

export default ProjectMedia;
