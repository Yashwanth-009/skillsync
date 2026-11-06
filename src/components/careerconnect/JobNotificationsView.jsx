import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bookmark,
  ExternalLink,
  Building2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  MapPin,
  Briefcase,
  Layers,
  ArrowLeft,
  X,
  Filter,
  Info,
  Calendar,
  Globe,
  Landmark,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCareerGuideStore } from '../../store/useCareerGuideStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import { useJobNotificationsStore } from '../../store/useJobNotificationsStore';
import { useToastStore } from '../../store/useToastStore';
import {
  JOB_OPPORTUNITIES,
  OFFICIAL_PORTALS_DIRECTORY,
  EDUCATION_QUALIFICATIONS,
  BRANCH_SPECIALIZATIONS,
  CATEGORY_FILTERS
} from '../../data/jobOpportunitiesData';

export const JobNotificationsView = ({ onBack }) => {
  const user = useAuthStore((state) => state.user);
  const guideBranch = useCareerGuideStore((state) => state.branch);
  const guideStage = useCareerGuideStore((state) => state.currentStage);
  const practiceBranch = usePracticeStore((state) => state.selectedBranch);
  const addToast = useToastStore((state) => state.addToast);

  const {
    savedOpportunities,
    searchQuery,
    selectedCategory,
    filterQualification,
    filterBranch,
    filterWorkMode,
    activeTabSection,
    setSearchQuery,
    setSelectedCategory,
    setFilterQualification,
    setFilterBranch,
    setFilterWorkMode,
    setActiveTabSection,
    toggleSaveOpportunity,
    isSaved,
    resetFilters
  } = useJobNotificationsStore();

  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [profileOverride, setProfileOverride] = useState(null);

  // Derive dynamic student profile
  const userEducation = useMemo(() => {
    if (profileOverride) return profileOverride;

    const rawCourse = (user?.course || '').trim();
    const rawBranch = (guideBranch || practiceBranch || '').trim();
    const rawYear = (user?.academicYear || user?.year || guideStage || '').trim();

    // Clean placeholder / defaults
    let cleanDegree = 'B.Tech';
    if (rawCourse) {
      if (rawCourse.toLowerCase().includes('diploma') || rawCourse.toLowerCase().includes('polytechnic')) cleanDegree = 'Polytechnic / Diploma';
      else if (rawCourse.toLowerCase().includes('m.tech') || rawCourse.toLowerCase().includes('mtech')) cleanDegree = 'M.Tech';
      else if (rawCourse.toLowerCase().includes('b.sc') || rawCourse.toLowerCase().includes('bsc')) cleanDegree = 'B.Sc.';
      else if (rawCourse.toLowerCase().includes('b.com') || rawCourse.toLowerCase().includes('bcom')) cleanDegree = 'B.Com.';
      else if (rawCourse.toLowerCase().includes('mba')) cleanDegree = 'MBA';
      else if (rawCourse.toLowerCase().includes('intermediate') || rawCourse.toLowerCase().includes('12th')) cleanDegree = 'Intermediate / 10+2';
      else if (rawCourse.toLowerCase().includes('b.e') || rawCourse.toLowerCase().includes('be')) cleanDegree = 'B.E.';
      else cleanDegree = rawCourse;
    }

    let cleanBranch = 'Computer Science';
    if (rawBranch) {
      if (rawBranch.toLowerCase().includes('mech')) cleanBranch = 'Mechanical Engineering';
      else if (rawBranch.toLowerCase().includes('civil')) cleanBranch = 'Civil Engineering';
      else if (rawBranch.toLowerCase().includes('ece') || rawBranch.toLowerCase().includes('electronics')) cleanBranch = 'Electronics & Communication';
      else if (rawBranch.toLowerCase().includes('eee') || rawBranch.toLowerCase().includes('electrical')) cleanBranch = 'Electrical Engineering';
      else if (rawBranch.toLowerCase().includes('ai') || rawBranch.toLowerCase().includes('ml')) cleanBranch = 'AI & Machine Learning';
      else if (rawBranch.toLowerCase().includes('data')) cleanBranch = 'Data Science';
      else if (rawBranch.toLowerCase().includes('it') || rawBranch.toLowerCase().includes('information')) cleanBranch = 'Information Technology';
      else cleanBranch = rawBranch;
    }

    let cleanYear = '3rd Year';
    if (rawYear) {
      if (rawYear.toLowerCase().includes('1') || rawYear.toLowerCase().includes('freshman')) cleanYear = '1st Year';
      else if (rawYear.toLowerCase().includes('2') || rawYear.toLowerCase().includes('sophomore')) cleanYear = '2nd Year';
      else if (rawYear.toLowerCase().includes('3') || rawYear.toLowerCase().includes('junior')) cleanYear = '3rd Year';
      else if (rawYear.toLowerCase().includes('4') || rawYear.toLowerCase().includes('senior') || rawYear.toLowerCase().includes('final')) cleanYear = '4th Year';
      else if (rawYear.toLowerCase().includes('grad') || rawYear.toLowerCase().includes('complete')) cleanYear = 'Completed / Graduated';
    }

    return {
      degree: cleanDegree,
      branch: cleanBranch,
      year: cleanYear
    };
  }, [user, guideBranch, guideStage, practiceBranch, profileOverride]);

  // Handle External Safe Redirection
  const handleVisitOfficialWebsite = (e, opportunity) => {
    e.stopPropagation();
    const targetUrl = opportunity.officialNotificationUrl || opportunity.officialUrl;
    if (!targetUrl) return;

    // Direct redirection to official HTTPS portals
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    addToast({
      title: 'Redirecting to Official Portal',
      message: `Opening official portal for ${opportunity.orgName}. Remember to verify eligibility details.`,
      type: 'info'
    });
  };

  // Toggle Bookmark
  const handleToggleBookmark = (e, opportunityId, title) => {
    e.stopPropagation();
    toggleSaveOpportunity(opportunityId);
    const saved = !isSaved(opportunityId);
    addToast({
      title: saved ? 'Opportunity Bookmarked' : 'Removed from Bookmarks',
      message: saved ? `Saved "${title}" to your Bookmarks.` : `Removed "${title}".`,
      type: 'success'
    });
  };

  // Check matching score with student profile
  const isProfileMatch = (opp) => {
    // Check qualification match
    const degMatch = opp.qualifications.some(
      (q) => q.toLowerCase().includes(userEducation.degree.toLowerCase()) ||
             userEducation.degree.toLowerCase().includes(q.toLowerCase())
    );

    // Check branch match
    const branchMatch = opp.branches.includes('All Branches') ||
      opp.branches.some(
        (b) => b.toLowerCase().includes(userEducation.branch.toLowerCase()) ||
               userEducation.branch.toLowerCase().includes(b.toLowerCase())
      );

    return degMatch && branchMatch;
  };

  // Filtered Opportunities List
  const filteredOpportunities = useMemo(() => {
    return JOB_OPPORTUNITIES.filter((opp) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          opp.title.toLowerCase().includes(q) ||
          opp.orgName.toLowerCase().includes(q) ||
          opp.orgFullName.toLowerCase().includes(q) ||
          opp.shortDescription.toLowerCase().includes(q) ||
          opp.qualifications.some((qual) => qual.toLowerCase().includes(q)) ||
          opp.branches.some((br) => br.toLowerCase().includes(q)) ||
          opp.location.toLowerCase().includes(q);

        if (!matchesQuery) return false;
      }

      // 2. Category Filter
      if (selectedCategory === 'saved') {
        if (!savedOpportunities.includes(opp.id)) return false;
      } else if (selectedCategory === 'gov_jobs') {
        if (opp.category !== 'government' || opp.type !== 'job') return false;
      } else if (selectedCategory === 'pvt_jobs') {
        if (opp.category !== 'private' || opp.type !== 'job') return false;
      } else if (selectedCategory === 'gov_internships') {
        if (opp.category !== 'government' || opp.type !== 'internship') return false;
      } else if (selectedCategory === 'pvt_internships') {
        if (opp.category !== 'private' || opp.type !== 'internship') return false;
      } else if (selectedCategory === 'apprenticeships') {
        if (opp.type !== 'apprenticeship') return false;
      } else if (selectedCategory === 'tg_jobs') {
        if (!opp.location.toLowerCase().includes('telangana') && !opp.orgName.toLowerCase().includes('tgpsc')) return false;
      }

      // 3. Dropdown Qualification Filter
      if (filterQualification !== 'all') {
        const matchesQual = opp.qualifications.some(
          (q) => q.toLowerCase() === filterQualification.toLowerCase()
        );
        if (!matchesQual) return false;
      }

      // 4. Dropdown Branch Filter
      if (filterBranch !== 'all') {
        const matchesBr = opp.branches.includes('All Branches') ||
          opp.branches.some((b) => b.toLowerCase() === filterBranch.toLowerCase());
        if (!matchesBr) return false;
      }

      // 5. Work Mode Filter
      if (filterWorkMode !== 'all') {
        if (opp.workMode.toLowerCase() !== filterWorkMode.toLowerCase()) return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedCategory,
    savedOpportunities,
    filterQualification,
    filterBranch,
    filterWorkMode
  ]);

  // Split into Recommended and Explore when on 'all' without active search/filters
  const { recommended, explore } = useMemo(() => {
    if (selectedCategory !== 'all' || searchQuery.trim() || filterQualification !== 'all' || filterBranch !== 'all') {
      return { recommended: filteredOpportunities, explore: [] };
    }

    const rec = [];
    const exp = [];

    filteredOpportunities.forEach((opp) => {
      if (isProfileMatch(opp)) {
        rec.push(opp);
      } else {
        exp.push(opp);
      }
    });

    return { recommended: rec, explore: exp };
  }, [filteredOpportunities, selectedCategory, searchQuery, filterQualification, filterBranch, userEducation]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    filterQualification !== 'all' ||
    filterBranch !== 'all' ||
    filterWorkMode !== 'all';

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      {/* 1. Header & Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1.5 hover:underline cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Career Connect Hub</span>
        </button>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setActiveTabSection(activeTabSection === 'feed' ? 'portals' : 'feed')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all flex items-center space-x-1 cursor-pointer border ${
              activeTabSection === 'portals'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>{activeTabSection === 'portals' ? 'Show Feed' : 'Official Portals (15)'}</span>
          </button>
        </div>
      </div>

      {/* 2. Personalized Academic Profile Match Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-cyan-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-3xl p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Profile Matched</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Personalized Career Discovery
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                {userEducation.degree}
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="font-bold text-xs text-emerald-700 dark:text-emerald-300">
                {userEducation.branch}
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {userEducation.year}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              Opportunities automatically tailored to your qualification and branch without manual re-entry.
            </p>
          </div>

          <button
            onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
            className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 hover:shadow-md transition-all cursor-pointer shrink-0"
            title="Adjust Degree or Filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Expandable Fast Profile / Degree Switcher */}
        {showFiltersDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 space-y-3"
          >
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Simulate Another Qualification / Branch:</span>
              {profileOverride && (
                <button
                  onClick={() => setProfileOverride(null)}
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 underline font-semibold"
                >
                  Reset to Actual Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Qualification</label>
                <select
                  value={userEducation.degree}
                  onChange={(e) => setProfileOverride({ ...userEducation, degree: e.target.value })}
                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {EDUCATION_QUALIFICATIONS.filter((q) => q !== 'All Qualifications').map((qual) => (
                    <option key={qual} value={qual}>{qual}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Branch</label>
                <select
                  value={userEducation.branch}
                  onChange={(e) => setProfileOverride({ ...userEducation, branch: e.target.value })}
                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {BRANCH_SPECIALIZATIONS.filter((b) => b !== 'All Branches').map((br) => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 3. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs, internships, companies or roles..."
          className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 4. Horizontal Category Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        {CATEGORY_FILTERS.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const isSavedTab = cat.id === 'saved';
          const savedCount = savedOpportunities.length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/70 hover:border-emerald-300'
              }`}
            >
              {isSavedTab ? (
                <Bookmark className={`w-3.5 h-3.5 ${isSelected ? 'fill-white' : 'text-amber-500'}`} />
              ) : null}
              <span>{cat.label}</span>
              {isSavedTab && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {savedCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Filter Clear Tag */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-xs px-1 text-slate-500">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredOpportunities.length}</strong> matching opportunities
          </span>
          <button
            onClick={resetFilters}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold text-[11px] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* VIEW: OFFICIAL PORTALS DIRECTORY TAB */}
      {activeTabSection === 'portals' && (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="font-extrabold text-emerald-800 dark:text-emerald-300">Verified Official Directory:</strong> Direct links to top 15 verified Indian government, PSU, and corporate career portals. Never trust unverified third-party brokers.
            </div>
          </div>

          <div className="space-y-2">
            {OFFICIAL_PORTALS_DIRECTORY.map((portal) => (
              <div
                key={portal.id}
                className="bg-white dark:bg-slate-800/90 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between space-x-3 hover:border-emerald-300 transition-all"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      #{portal.priority} • {portal.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono truncate">{portal.domain}</span>
                  </div>
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {portal.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {portal.purpose}
                  </p>
                </div>

                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 flex items-center space-x-1 shadow-sm transition-transform active:scale-95"
                >
                  <span>Visit</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: MAIN OPPORTUNITIES FEED */}
      {activeTabSection === 'feed' && (
        <div className="space-y-5">
          {/* SECTION 1: RECOMMENDED FOR YOU */}
          {recommended.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                    Recommended For You
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                    {recommended.length}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400">
                  Matches {userEducation.degree} • {userEducation.branch.split(' ')[0]}
                </span>
              </div>

              <div className="space-y-3">
                {recommended.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    isSaved={isSaved(opp.id)}
                    onToggleBookmark={(e) => handleToggleBookmark(e, opp.id, opp.title)}
                    onVisit={(e) => handleVisitOfficialWebsite(e, opp)}
                    isRecommended={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: EXPLORE OTHER OPPORTUNITIES */}
          {explore.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                    Explore Other Opportunities
                  </h3>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {explore.length}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400">
                  Verify individual eligibility
                </span>
              </div>

              <div className="space-y-3">
                {explore.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    isSaved={isSaved(opp.id)}
                    onToggleBookmark={(e) => handleToggleBookmark(e, opp.id, opp.title)}
                    onVisit={(e) => handleVisitOfficialWebsite(e, opp)}
                    isRecommended={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {filteredOpportunities.length === 0 && (
            <div className="text-center py-10 px-4 bg-white dark:bg-slate-800/80 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                No matching opportunities found
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {selectedCategory === 'saved'
                  ? 'You haven’t saved any opportunities yet. Tap the bookmark icon on any card to save it here.'
                  : 'Try adjusting your search keywords, clear filters, or check the official portals directory.'}
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* 5. Official Opportunity Discovery Notice / Transparency Disclaimer */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 shadow-xs">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>SkillSync Opportunity Discovery & Transparency Notice</span>
            </div>
            <p className="leading-relaxed">
              SkillSync operates solely as an educational career opportunity discovery and personalization platform. SkillSync does <strong>not</strong> collect job applications, accept resumes, charge recruitment fees, or host private hiring tests. All eligibility criteria, deadlines, and application processes must be verified directly on the respective official recruitment portals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Professional Opportunity Card Component
const OpportunityCard = ({
  opportunity,
  isSaved,
  onToggleBookmark,
  onVisit,
  isRecommended
}) => {
  const [expanded, setExpanded] = useState(false);

  const categoryColor =
    opportunity.category === 'government'
      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300/50'
      : 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-300/50';

  const typeLabel =
    opportunity.type === 'internship'
      ? 'Internship'
      : opportunity.type === 'apprenticeship'
      ? 'Apprenticeship'
      : 'Full-Time Job';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-slate-800/95 rounded-3xl p-4 border transition-all shadow-sm hover:shadow-md relative overflow-hidden ${
        isRecommended
          ? 'border-emerald-200/90 dark:border-emerald-800/70'
          : 'border-slate-200 dark:border-slate-700/80'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          {/* Org Logo / Monogram */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-700 to-slate-900 text-white flex items-center justify-center font-heading font-extrabold text-sm shadow-xs shrink-0 tracking-wider">
            {opportunity.orgName.slice(0, 4)}
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                {opportunity.orgName}
              </h4>
              <span className="inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold" title="Verified Official Portal">
                <CheckCircle2 className="w-3 h-3 ml-0.5 fill-emerald-100 dark:fill-emerald-950" />
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[190px]">
              {opportunity.orgFullName}
            </p>
          </div>
        </div>

        {/* Bookmark Action */}
        <button
          onClick={onToggleBookmark}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isSaved
              ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
              : 'bg-slate-100 dark:bg-slate-700/60 text-slate-400 hover:text-slate-600'
          }`}
          title={isSaved ? 'Remove Bookmark' : 'Save Opportunity'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Opportunity Title & Badges */}
      <div className="mt-3 space-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${categoryColor}`}>
            {opportunity.category === 'government' ? '🏛️ Govt' : '💼 Private'} • {typeLabel}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {opportunity.workMode}
          </span>
          {opportunity.badge && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {opportunity.badge}
            </span>
          )}
        </div>

        <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
          {opportunity.title}
        </h3>

        <p className={`text-xs text-slate-600 dark:text-slate-300 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {opportunity.shortDescription}
        </p>

        {opportunity.shortDescription.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            {expanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>

      {/* Eligibility Pills */}
      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5">
        <div className="flex items-center space-x-1 text-[10px] text-slate-500">
          <GraduationCap className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Eligibility:</span>
          <span className="truncate">{opportunity.qualifications.slice(0, 3).join(', ')}</span>
        </div>

        <div className="flex items-center space-x-1 text-[10px] text-slate-500">
          <Layers className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Branches:</span>
          <span className="truncate">{opportunity.branches.slice(0, 3).join(', ')}</span>
        </div>

        {opportunity.location && (
          <div className="flex items-center space-x-1 text-[10px] text-slate-400">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
        )}
      </div>

      {/* Official Source & Action CTA */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        <div className="text-[9px] text-slate-400 space-y-0.5">
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="font-medium font-mono">{opportunity.sourceDomain}</span>
          </div>
          <div>Verified: {opportunity.lastVerifiedDate}</div>
        </div>

        <button
          onClick={onVisit}
          className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-heading font-extrabold text-xs shadow-md flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <span>Visit Official Website</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};
