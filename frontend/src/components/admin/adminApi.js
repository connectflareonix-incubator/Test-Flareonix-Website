import axios from 'axios';
import { API } from '@/config/constants';
import { adminAuthConfig } from './adminAuth';

const cfg = () => adminAuthConfig();

export const adminApi = {
  // metrics
  overview: () => axios.get(`${API}/admin/metrics/overview`, cfg()).then(r => r.data),
  timeseries: (days = 30) => axios.get(`${API}/admin/metrics/timeseries?days=${days}`, cfg()).then(r => r.data),
  // blog
  listPosts: () => axios.get(`${API}/admin/blog/posts`, cfg()).then(r => r.data),
  createPost: (b) => axios.post(`${API}/admin/blog/posts`, b, cfg()).then(r => r.data),
  updatePost: (id, b) => axios.put(`${API}/admin/blog/posts/${id}`, b, cfg()).then(r => r.data),
  deletePost: (id) => axios.delete(`${API}/admin/blog/posts/${id}`, cfg()).then(r => r.data),
  listComments: (filter = '') => axios.get(`${API}/admin/blog/comments${filter ? `?filter=${filter}` : ''}`, cfg()).then(r => r.data),
  updateComment: (id, b) => axios.put(`${API}/admin/blog/comments/${id}`, b, cfg()).then(r => r.data),
  deleteComment: (id) => axios.delete(`${API}/admin/blog/comments/${id}`, cfg()).then(r => r.data),
  // team
  listTeam: () => axios.get(`${API}/admin/team`, cfg()).then(r => r.data),
  createTeam: (b) => axios.post(`${API}/admin/team`, b, cfg()).then(r => r.data),
  updateTeam: (id, b) => axios.put(`${API}/admin/team/${id}`, b, cfg()).then(r => r.data),
  deleteTeam: (id) => axios.delete(`${API}/admin/team/${id}`, cfg()).then(r => r.data),
  // projects
  listProjects: () => axios.get(`${API}/projects`).then(r => r.data),
  createProject: (b) => axios.post(`${API}/admin/projects`, b, cfg()).then(r => r.data),
  updateProject: (id, b) => axios.put(`${API}/admin/projects/${id}`, b, cfg()).then(r => r.data),
  deleteProject: (id) => axios.delete(`${API}/admin/projects/${id}`, cfg()).then(r => r.data),
  // collabs
  listCollabs: () => axios.get(`${API}/collaborations`).then(r => r.data),
  createCollab: (b) => axios.post(`${API}/admin/collaborations`, b, cfg()).then(r => r.data),
  updateCollab: (id, b) => axios.put(`${API}/admin/collaborations/${id}`, b, cfg()).then(r => r.data),
  deleteCollab: (id) => axios.delete(`${API}/admin/collaborations/${id}`, cfg()).then(r => r.data),
  // inbox
  listContacts: () => axios.get(`${API}/admin/contact-submissions`, cfg()).then(r => r.data),
  updateContact: (id, b) => axios.put(`${API}/admin/contact-submissions/${id}`, b, cfg()).then(r => r.data),
  deleteContact: (id) => axios.delete(`${API}/admin/contact-submissions/${id}`, cfg()).then(r => r.data),
  // testimonials
  listTestimonials: () => axios.get(`${API}/admin/testimonials`, cfg()).then(r => r.data),
  createTestimonial: (b) => axios.post(`${API}/admin/testimonials`, b, cfg()).then(r => r.data),
  updateTestimonial: (id, b) => axios.put(`${API}/admin/testimonials/${id}`, b, cfg()).then(r => r.data),
  deleteTestimonial: (id) => axios.delete(`${API}/admin/testimonials/${id}`, cfg()).then(r => r.data),
  // reviews (legacy)
  listReviews: () => axios.get(`${API}/reviews/all`, cfg()).then(r => r.data),
  updateReview: (id, b) => axios.put(`${API}/reviews/${id}`, b, cfg()).then(r => r.data),
  deleteReview: (id) => axios.delete(`${API}/reviews/${id}`, cfg()).then(r => r.data),
  // users
  listUsers: () => axios.get(`${API}/admin/users`, cfg()).then(r => r.data),
  updateUser: (uid, b) => axios.put(`${API}/admin/users/${uid}`, b, cfg()).then(r => r.data),
  // announcements
  listAnnouncements: () => axios.get(`${API}/admin/announcements`, cfg()).then(r => r.data),
  createAnnouncement: (b) => axios.post(`${API}/admin/announcements`, b, cfg()).then(r => r.data),
  updateAnnouncement: (id, b) => axios.put(`${API}/admin/announcements/${id}`, b, cfg()).then(r => r.data),
  deleteAnnouncement: (id) => axios.delete(`${API}/admin/announcements/${id}`, cfg()).then(r => r.data),
  // settings
  getSettings: () => axios.get(`${API}/settings`).then(r => r.data),
  setSetting: (key, value) => axios.put(`${API}/admin/settings/${key}`, { value }, cfg()).then(r => r.data),
  // events
  listEvents: () => axios.get(`${API}/admin/events`, cfg()).then(r => r.data),
  createEvent: (b) => axios.post(`${API}/admin/events`, b, cfg()).then(r => r.data),
  updateEvent: (id, b) => axios.put(`${API}/admin/events/${id}`, b, cfg()).then(r => r.data),
  deleteEvent: (id) => axios.delete(`${API}/admin/events/${id}`, cfg()).then(r => r.data),
  listEventComments: (id) => axios.get(`${API}/admin/events/${id}/comments`, cfg()).then(r => r.data),
  deleteEventComment: (cid) => axios.delete(`${API}/admin/events/comments/${cid}`, cfg()).then(r => r.data),
  listEventWaitlist: (id) => axios.get(`${API}/admin/events/${id}/waitlist`, cfg()).then(r => r.data),
  deleteEventWaitlist: (wid) => axios.delete(`${API}/admin/events/waitlist/${wid}`, cfg()).then(r => r.data),
  // webhooks
  listWebhooks: () => axios.get(`${API}/admin/webhooks`, cfg()).then(r => r.data),
  updateWebhook: (id, b) => axios.put(`${API}/admin/webhooks/${id}`, b, cfg()).then(r => r.data),
  testWebhook: (id) => axios.post(`${API}/admin/webhooks/${id}/test`, {}, cfg()).then(r => r.data),
  // export csv (client-side from json)
};
