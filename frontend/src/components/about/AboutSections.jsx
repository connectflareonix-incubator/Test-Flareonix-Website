import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '@/config/constants';
import PhoenixDivider from '@/components/decor/PhoenixDivider';
import ProjectBlock from './ProjectBlock';
import TeamCard from './TeamCard';
import CollabCard from './CollabCard';

const AboutSections = () => {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [collabs, setCollabs] = useState([]);

  useEffect(() => {
    axios.get(`${API}/projects`).then((r) => setProjects(r.data || []));
    axios.get(`${API}/team`).then((r) => setTeam(r.data || []));
    axios.get(`${API}/collaborations`).then((r) => setCollabs(r.data || []));
  }, []);

  return (
    <>
      <section id="projects" className="py-20 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center" data-animate="fade-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
              Our <span className="text-primary">Projects</span>
            </h2>
          </div>
          <PhoenixDivider />
          {projects.length === 0 ? (
            <p className="text-center text-white/40">Coming soon.</p>
          ) : (
            <div className="space-y-16">
              {projects.map((p, i) => <ProjectBlock key={p.id} p={p} idx={i} />)}
            </div>
          )}
        </div>
      </section>

      <section id="gallery" className="py-20 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12" data-animate="fade-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
              Meet the <span className="text-primary">Team</span>
            </h2>
          </div>
          {team.length === 0 ? (
            <p className="text-center text-white/40">Coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6" data-stagger-children>
              {team.map((m) => <TeamCard key={m.id} m={m} />)}
            </div>
          )}
        </div>
      </section>

      <section id="collaborations" className="py-20 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12" data-animate="fade-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
              Our Ecosystem — <span className="text-primary">Partners, Collaborators & Recognitions</span>
            </h2>
          </div>
          {collabs.length === 0 ? (
            <p className="text-center text-white/40">Our partnerships will be listed here soon.</p>
          ) : (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-5" data-stagger-children>
              {collabs.map((c) => <CollabCard key={c.id} c={c} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AboutSections;
