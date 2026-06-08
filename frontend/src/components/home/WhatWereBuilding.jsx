/* "What We're Building" — public preview block pulling from admin CMS. */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Linkedin, Flame } from 'lucide-react';
import axios from 'axios';
import { API } from '@/config/constants';
import { categoryLabel, categoryColor } from '@/lib/blogMeta';

const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';

const initials = (name) => (name || '').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

const WhatWereBuilding = () => {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [posts, setPosts] = useState([]);
  const [collabs, setCollabs] = useState([]);

  useEffect(() => {
    axios.get(`${API}/projects`).then((r) => setProjects((r.data || []).slice(0, 3))).catch(() => {});
    axios.get(`${API}/team`).then((r) => setTeam((r.data || []).slice(0, 3))).catch(() => {});
    axios.get(`${API}/blog/posts`).then((r) => setPosts((r.data || []).slice(0, 3))).catch(() => {});
    axios.get(`${API}/collaborations`).then((r) => setCollabs(r.data || [])).catch(() => {});
  }, []);

  return (
    <section className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12" data-animate="fade-up">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
            What We&apos;re <span className="text-primary">Building</span> <Flame className="inline h-9 w-9 text-primary" />
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            A peek into the projects we&apos;re shipping, the people behind them, and the partners in our ecosystem.
          </p>
        </div>

        {/* Projects */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-5">
            <h3 className="font-heading text-xl font-bold text-white">Projects in motion</h3>
            <Link to="/about#projects" className="text-sm text-primary inline-flex items-center gap-1">Explore all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-white/40 text-sm">Coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-5" data-stagger-children>
              {projects.map((p) => (
                <div key={p.id} className="relative p-5 rounded-xl bg-[#141414] border-t-[3px] border-t-primary border border-white/10">
                  <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-semibold ${p.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'}`}>
                    {p.status}
                  </span>
                  <h4 className="font-heading font-bold text-white pr-20 mb-2">{p.title}</h4>
                  <p className="text-sm text-white/60 line-clamp-2">{p.description}</p>
                  {p.client_partner_name && <p className="text-xs text-white/40 mt-2">Client: {p.client_partner_name}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-5">
            <h3 className="font-heading text-xl font-bold text-white">The team behind the fire</h3>
            <Link to="/about#gallery" className="text-sm text-primary inline-flex items-center gap-1">Meet the team <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {team.length === 0 ? (
            <p className="text-white/40 text-sm">Coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-5" data-stagger-children>
              {team.map((m) => (
                <div key={m.id} className="p-5 rounded-xl bg-[#141414] border border-white/10 text-center">
                  {m.photo_url
                    ? <img src={m.photo_url} alt={m.name} className="h-20 w-20 rounded-full object-cover mx-auto mb-3" />
                    : <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-[#CC2200] mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg">{initials(m.name)}</div>
                  }
                  <h4 className="font-heading font-bold text-white">{m.name}</h4>
                  <div className="text-sm text-primary">{m.role}</div>
                  {m.linkedin_url && (
                    <a href={m.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-primary mt-2">
                      <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Blog */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-5">
            <h3 className="font-heading text-xl font-bold text-white">From the journal</h3>
            <Link to="/blog" className="text-sm text-primary inline-flex items-center gap-1">Read all updates <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {posts.length === 0 ? (
            <p className="text-white/40 text-sm">First post coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-5" data-stagger-children>
              {posts.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="p-5 rounded-xl bg-[#141414] border border-white/10 hover:border-primary/40 transition">
                  <span className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ background: `${categoryColor(p.category)}22`, color: categoryColor(p.category) }}>{categoryLabel(p.category)}</span>
                  <h4 className="font-heading font-bold text-white mt-2 line-clamp-2">{p.title}</h4>
                  <div className="text-xs text-white/40 mt-2 inline-flex items-center gap-2">
                    {fmtDate(p.created_at)} · <MessageSquare className="h-3 w-3 inline" /> {(p.comments?.length || 0)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Collaborations */}
        {collabs.length > 0 && (
          <div>
            <h3 className="font-heading text-xl font-bold text-white mb-4 text-center">Our Ecosystem</h3>
            <div className="flex flex-wrap justify-center gap-3" data-animate="fade-in">
              {collabs.map((c) => (
                <a key={c.id} href={c.link || '#'} target={c.link ? '_blank' : undefined} rel="noreferrer" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 text-sm text-white/80">
                  {c.org_name} <span className="text-white/40 text-xs ml-1">· {c.year}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhatWereBuilding;
