/**
 * Developer Profile Page
 * 
 * A premium, inspiring developer profile page for Avni Sharma,
 * the developer behind iamthere – Be There Together.
 * 
 * Features:
 * - Dark purple theme matching iamthere branding
 * - Glassmorphism + neon glow effects
 * - Smooth animations with Framer Motion
 * - Fully responsive design
 * - Professional portfolio showcase
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ============================================================================
// ICONS - Custom SVG Icons for the page
// ============================================================================

const Icons = {
  // Social & Contact
  LinkedIn: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Email: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Location: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  
  // Skills Icons
  Python: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
    </svg>
  ),
  Database: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  Code: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  Chart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Tool: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Trophy: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  GraduationCap: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Rocket: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

// ============================================================================
// ANIMATED BACKGROUND COMPONENT
// ============================================================================

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// SECTION WRAPPER COMPONENT
// ============================================================================

const Section = ({ children, className = '', id }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById(id);
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [id]);
  
  return (
    <section
      id={id}
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
    >
      {children}
    </section>
  );
};

// ============================================================================
// SKILL TAG COMPONENT
// ============================================================================

const SkillTag = ({ skill, delay = 0 }) => {
  return (
    <div
      className="group px-4 py-2 bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl
                 hover:bg-purple-500/20 hover:border-purple-400/50 hover:scale-105
                 transition-all duration-300 cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-gray-300 group-hover:text-white transition-colors">{skill}</span>
    </div>
  );
};

// ============================================================================
// PROJECT CARD COMPONENT
// ============================================================================

const ProjectCard = ({ project }) => {
  return (
    <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl 
                    border border-purple-500/20 rounded-2xl p-6 
                    hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20
                    hover:-translate-y-2 transition-all duration-500">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      
      <div className="relative">
        {/* Icon */}
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl 
                        flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30
                        group-hover:scale-110 transition-transform duration-300">
          {project.icon}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
          {project.title}
        </h3>
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
        
        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          {project.description}
        </p>
        
        {/* Highlights */}
        <ul className="space-y-2">
          {project.highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
              <Icons.Sparkles />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ============================================================================
// TIMELINE ITEM COMPONENT
// ============================================================================

const TimelineItem = ({ item, isLast }) => {
  return (
    <div className="relative pl-8 pb-8">
      {/* Line */}
      {!isLast && (
        <div className="absolute left-3 top-8 w-0.5 h-full bg-gradient-to-b from-purple-500 to-transparent" />
      )}
      
      {/* Dot */}
      <div className="absolute left-0 top-1 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 
                      rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
      
      {/* Content */}
      <div className="group bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5
                      hover:bg-white/10 hover:border-purple-400/40 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
            {item.icon}
          </div>
          <div>
            <h4 className="font-semibold text-white">{item.title}</h4>
            <p className="text-sm text-purple-400">{item.organization}</p>
          </div>
        </div>
        
        {item.date && (
          <p className="text-xs text-gray-500 mb-3">{item.date}</p>
        )}
        
        <ul className="space-y-1">
          {item.points.map((point, index) => (
            <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ============================================================================
// ACHIEVEMENT BADGE COMPONENT
// ============================================================================

const AchievementBadge = ({ achievement }) => {
  return (
    <div className="group flex items-center gap-4 bg-gradient-to-r from-white/5 to-white/10 
                    backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4
                    hover:border-yellow-400/50 hover:bg-yellow-500/10 
                    transition-all duration-300 hover:scale-105">
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 
                      rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30
                      group-hover:scale-110 transition-transform duration-300">
        <span className="text-2xl">{achievement.emoji}</span>
      </div>
      
      {/* Content */}
      <div>
        <h4 className="font-semibold text-white text-sm">{achievement.title}</h4>
        <p className="text-xs text-gray-400">{achievement.subtitle}</p>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN DEVELOPER PAGE COMPONENT
// ============================================================================

const Developer = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Developer Data
  const developer = {
    name: 'Avni Sharma',
    title: 'Developer behind iamthere – Be There Together',
    tagline: 'Building communities, analyzing data, and creating impact through technology.',
    email: 'avnivandil1@gmail.com',
    linkedin: 'https://linkedin.com/in/avni-sharma',
    photo: 'https://raw.githubusercontent.com/developerkunalonline/test_images_for_host/refs/heads/main/WhatsApp%20Image%202025-12-27%20at%203.03.06%20AM.jpeg',
  };
  
  const skills = {
    programming: ['Python', 'SQL', 'C', 'HTML', 'JavaScript'],
    analytics: ['Data Cleaning', 'Exploratory Data Analysis', 'Descriptive Analytics', 'Data Visualization'],
    tools: ['Power BI', 'Excel', 'Pandas', 'NumPy', 'Streamlit', 'Matplotlib', 'Plotly'],
  };
  
  const projects = [
    {
      title: 'Data Analytics Project – End-to-End Analysis & Dashboard',
      icon: <Icons.Chart />,
      tech: ['Python', 'SQL', 'Power BI', 'Excel'],
      description: 'Comprehensive data analytics solution with end-to-end analysis and interactive dashboards for business intelligence.',
      highlights: [
        'End-to-end analytics on structured business datasets',
        'Data cleaning & preprocessing using Pandas & NumPy',
        'Advanced SQL queries (joins, aggregations, filters)',
        'Interactive Power BI dashboards with KPIs & DAX',
        'Business insights presented via professional Gamma decks',
      ],
    },
    {
      title: 'Netflix Content Analytics Dashboard',
      icon: <Icons.Globe />,
      tech: ['Python', 'Streamlit', 'Plotly'],
      description: 'Interactive dashboard analyzing Netflix\'s content library with visual insights on trends, genres, and regional patterns.',
      highlights: [
        '8,800+ Netflix titles analyzed (1925–2021)',
        'Genre evolution & regional trends visualization',
        'Interactive filters (year, country, genre, rating)',
        'Multi-page Streamlit dashboard',
        'Deployed on GitHub & Streamlit Cloud',
      ],
    },
  ];
  
  const experience = [
    {
      title: 'Campus Ambassador',
      organization: 'IIT Roorkee',
      icon: <Icons.Users />,
      points: [
        'Promoted workshops & technical events across campus',
        'Engaged 200+ students in various technical programs',
        'Increased event participation by approximately 30%',
        'Coordinated with organizing teams for seamless execution',
      ],
    },
    {
      title: 'NSS Volunteer',
      organization: 'National Service Scheme',
      date: '2022 – 2024',
      icon: <Icons.Heart />,
      points: [
        'Organized health awareness & cleanliness drives',
        'Positively impacted 500+ community members',
        'Developed strong leadership & teamwork experience',
        'Contributed to social welfare initiatives',
      ],
    },
  ];
  
  const achievements = [
    {
      emoji: '🥇',
      title: 'Hackathon Finalist – ZipTales',
      subtitle: 'IIIT Gwalior (1200+ teams)',
    },
    {
      emoji: '🥇',
      title: 'Hackathon Finalist – Manas Mandal',
      subtitle: 'UEM Jaipur',
    },
    {
      emoji: '💻',
      title: '15+ Hackathons',
      subtitle: 'Participated across India',
    },
    {
      emoji: '🌍',
      title: 'Open Source Contributor – Rank 73',
      subtitle: 'Social Winter of Code (SWoC) 2024–25',
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.5), 0 0 90px rgba(139, 92, 246, 0.2); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        .text-gradient {
          background: linear-gradient(135deg, #a855f7, #ec4899, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
      `}</style>
      
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-purple-500/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <Icons.ArrowLeft />
            <span>Back to iamthere</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <a
              href={developer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 hover:bg-purple-500/20 rounded-lg transition-colors"
            >
              <Icons.LinkedIn />
            </a>
            <a
              href={`mailto:${developer.email}`}
              className="p-2 bg-white/5 hover:bg-purple-500/20 rounded-lg transition-colors"
            >
              <Icons.Email />
            </a>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <Section id="hero" className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Photo */}
            <div className="relative group">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 
                              rounded-full opacity-75 blur-xl animate-glow-pulse" />
              
              {/* Photo Container */}
              <div className="relative w-64 h-64 rounded-full overflow-hidden 
                              border-4 border-purple-500/50 animate-float"
                   style={{ animationDuration: '8s' }}>
                <img
                  src={developer.photo}
                  alt={developer.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 
                              rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Icons.Star />
              </div>
            </div>
            
            {/* Hero Content */}
            <div className="text-center lg:text-left flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 
                              border border-purple-500/30 rounded-full mb-6">
                <Icons.Sparkles />
                <span className="text-sm text-purple-300">Developer & Community Builder</span>
              </div>
              
              {/* Name */}
              <h1 className="text-5xl lg:text-7xl font-bold mb-4">
                <span className="text-gradient animate-gradient">{developer.name}</span>
              </h1>
              
              {/* Title */}
              <p className="text-xl lg:text-2xl text-gray-300 mb-4">
                {developer.title}
              </p>
              
              {/* Tagline */}
              <p className="text-lg text-gray-400 max-w-xl mb-8">
                "{developer.tagline}"
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                <a
                  href={developer.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                             rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 
                             hover:scale-105 transition-all duration-300"
                >
                  <Icons.LinkedIn />
                  View LinkedIn
                  <Icons.ExternalLink />
                </a>
                
                <a
                  href={`mailto:${developer.email}`}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-purple-500/30 
                             rounded-xl font-semibold hover:bg-purple-500/20 hover:border-purple-400/50
                             hover:scale-105 transition-all duration-300"
                >
                  <Icons.Email />
                  Contact Developer
                </a>
                
                <a
                  href="#projects"
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 
                             rounded-xl font-semibold hover:bg-white/10 
                             hover:scale-105 transition-all duration-300"
                >
                  <Icons.Rocket />
                  View Projects
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>
      
      {/* About Section */}
      <Section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="p-3 bg-purple-500/20 rounded-xl">
                <Icons.Heart />
              </span>
              About Me
            </h2>
            
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                I'm a <span className="text-purple-400 font-semibold">final-year B.Tech IT student</span> at 
                Banasthali Vidyapith, passionate about technology, leadership, and creating meaningful impact 
                through innovative solutions.
              </p>
              
              <p>
                As an <span className="text-pink-400 font-semibold">Open Source Contributor</span>, 
                <span className="text-cyan-400 font-semibold"> Tech Community Manager</span> at Elite Coders Community, 
                and <span className="text-purple-400 font-semibold">Core Team Member</span> at AAYAM (Tech Club), 
                I've had the privilege of building and nurturing tech communities while developing my technical skills.
              </p>
              
              <p>
                I'm deeply passionate about <span className="text-pink-400 font-semibold">data analytics</span>, 
                <span className="text-cyan-400 font-semibold"> hackathons</span>, and 
                <span className="text-purple-400 font-semibold"> tech events</span>. 
                My journey involves transforming raw data into actionable insights and building solutions 
                that make a real difference in people's lives.
              </p>
            </div>
            
            {/* Education Card */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                            rounded-2xl border border-purple-500/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Icons.GraduationCap />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Banasthali Vidyapith</h3>
                  <p className="text-purple-400 font-medium">B.Tech in Information Technology</p>
                  <p className="text-gray-400 text-sm mt-1">📆 2022 – 2026 • 📍 Rajasthan, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Skills Section */}
      <Section id="skills" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-gradient">Technical Skills</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Programming */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                  <Icons.Code />
                </div>
                <h3 className="text-xl font-bold">Programming</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.programming.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} delay={index * 100} />
                ))}
              </div>
            </div>
            
            {/* Data Analytics */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Icons.Chart />
                </div>
                <h3 className="text-xl font-bold">Data Analytics</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.analytics.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} delay={index * 100} />
                ))}
              </div>
            </div>
            
            {/* Tools & Technologies */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl">
                  <Icons.Tool />
                </div>
                <h3 className="text-xl font-bold">Tools & Technologies</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} delay={index * 100} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Projects Section */}
      <Section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">
            <span className="text-gradient">Featured Projects</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Transforming data into insights and building solutions that create real impact
          </p>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      </Section>
      
      {/* Experience Section */}
      <Section id="experience" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-gradient">Experience</span>
          </h2>
          
          <div className="relative">
            {experience.map((item, index) => (
              <TimelineItem 
                key={index} 
                item={item} 
                isLast={index === experience.length - 1} 
              />
            ))}
          </div>
        </div>
      </Section>
      
      {/* Achievements Section */}
      <Section id="achievements" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">
            <span className="text-gradient">Achievements</span>
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Milestones in the journey of learning and building
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <AchievementBadge key={index} achievement={achievement} />
            ))}
          </div>
        </div>
      </Section>
      
      {/* Contact Section */}
      <Section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gradient">Let's Connect</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Let's collaborate and build something meaningful together. 
              I'm always excited to discuss new opportunities and ideas.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {/* Email Card */}
              <a
                href={`mailto:${developer.email}`}
                className="group p-6 bg-white/5 rounded-2xl border border-purple-500/20
                           hover:bg-purple-500/10 hover:border-purple-400/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl 
                                flex items-center justify-center mx-auto mb-3
                                group-hover:scale-110 transition-transform duration-300">
                  <Icons.Email />
                </div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white text-sm truncate">{developer.email}</p>
              </a>
              
              {/* LinkedIn Card */}
              <a
                href={developer.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-white/5 rounded-2xl border border-purple-500/20
                           hover:bg-purple-500/10 hover:border-purple-400/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl 
                                flex items-center justify-center mx-auto mb-3
                                group-hover:scale-110 transition-transform duration-300">
                  <Icons.LinkedIn />
                </div>
                <p className="text-sm text-gray-400">LinkedIn</p>
                <p className="text-white text-sm">avni-sharma</p>
              </a>
            </div>
            
            <a
              href={`mailto:${developer.email}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 
                         rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/30 
                         hover:scale-105 transition-all duration-300"
            >
              <Icons.Email />
              Get in Touch
            </a>
          </div>
        </div>
      </Section>
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-purple-500/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl text-gray-400 italic mb-6">
            "Behind every great product is a developer who truly cares."
          </p>
          
          <div className="flex items-center justify-center gap-2 text-purple-400 mb-4">
            <span className="text-2xl">💜</span>
            <span className="font-semibold">iamthere</span>
            <span className="text-gray-500">– Be There Together</span>
          </div>
          
          <p className="text-sm text-gray-500">
            Made with love • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Developer;
