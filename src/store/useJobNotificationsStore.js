import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useJobNotificationsStore = create(
  persist(
    (set, get) => ({
      savedOpportunities: ['opp-isro-internship-2025', 'opp-tcs-careers-fresher'], // Default curated saved items for instant discovery delight
      searchQuery: '',
      selectedCategory: 'all', // 'all' | 'gov_jobs' | 'pvt_jobs' | 'gov_internships' | 'pvt_internships' | 'apprenticeships' | 'tg_jobs' | 'saved'
      filterQualification: 'all',
      filterBranch: 'all',
      filterWorkMode: 'all',
      activeTabSection: 'feed', // 'feed' | 'portals'

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setFilterQualification: (qual) => set({ filterQualification: qual }),
      setFilterBranch: (branch) => set({ filterBranch: branch }),
      setFilterWorkMode: (mode) => set({ filterWorkMode: mode }),
      setActiveTabSection: (section) => set({ activeTabSection: section }),

      toggleSaveOpportunity: (id) => {
        const { savedOpportunities } = get();
        if (savedOpportunities.includes(id)) {
          set({ savedOpportunities: savedOpportunities.filter((item) => item !== id) });
        } else {
          set({ savedOpportunities: [...savedOpportunities, id] });
        }
      },

      isSaved: (id) => {
        return (get().savedOpportunities || []).includes(id);
      },

      resetFilters: () => {
        set({
          searchQuery: '',
          selectedCategory: 'all',
          filterQualification: 'all',
          filterBranch: 'all',
          filterWorkMode: 'all'
        });
      }
    }),
    {
      name: 'SkillSync_job_notifications_v1',
      partialize: (state) => ({
        savedOpportunities: state.savedOpportunities,
        selectedCategory: state.selectedCategory
      })
    }
  )
);
