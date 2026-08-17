import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProductItem,
  HostelProperty,
  JobPosting,
  StudyMaterial,
  StudentQuiz,
  StudentMarkRow,
  CustomTracker,
  StudyGroup,
  MentorProfile,
  EFootballTournament,
  OrderRecord,
  WalkthroughSession
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_HOSTELS,
  INITIAL_JOBS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_QUIZZES,
  INITIAL_SCHOOL_MARKS,
  INITIAL_CUSTOM_TRACKERS,
  INITIAL_STUDY_GROUPS,
  INITIAL_MENTORS,
  INITIAL_EFOOTBALL_TOURNAMENT,
  INITIAL_ORDERS
} from '../services/mockData';
import { PesapalPaymentIntent } from '../services/pesapalService';

export type ActivePage =
  | 'home'
  | 'feed'
  | 'findlocal'
  | 'marketplace'
  | 'schools'
  | 'companies'
  | 'landlords'
  | 'students'
  | 'services'
  | 'orders'
  | 'drive'
  | 'admin_kyc';

interface AppContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  
  // Data lists
  products: ProductItem[];
  addProduct: (item: Omit<ProductItem, 'id' | 'rating' | 'reviewsCount'>) => void;
  hostels: HostelProperty[];
  addHostel: (hostel: Omit<HostelProperty, 'id' | 'walkthroughSessions'>) => void;
  jobs: JobPosting[];
  addJob: (job: Omit<JobPosting, 'id'>) => void;
  studyMaterials: StudyMaterial[];
  addStudyMaterial: (mat: Omit<StudyMaterial, 'id' | 'downloadsCount' | 'rating'>) => void;
  quizzes: StudentQuiz[];
  schoolMarks: StudentMarkRow[];
  addSchoolMark: (mark: StudentMarkRow) => void;
  customTrackers: CustomTracker[];
  updateTrackerRecord: (trackerId: string, recordId: string, col: string, value: string | boolean) => void;
  addNewTracker: (trackerName: string, description: string, columns: string[]) => void;
  studyGroups: StudyGroup[];
  sendStudyGroupMessage: (groupId: string, senderName: string, text: string, attachmentTitle?: string) => void;
  mentors: MentorProfile[];
  tournament: EFootballTournament;
  joinTournament: (playerUsername: string) => void;
  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  
  // Modals & Interactivity
  activeLiveSession: {
    title: string;
    hostName: string;
    youtubeUrl: string;
    propertyId?: string;
    productId?: string;
    isGroup?: boolean;
  } | null;
  openLiveSession: (session: {
    title: string;
    hostName: string;
    youtubeUrl: string;
    propertyId?: string;
    productId?: string;
    isGroup?: boolean;
  }) => void;
  closeLiveSession: () => void;

  checkoutIntent: PesapalPaymentIntent | null;
  openCheckout: (intent: PesapalPaymentIntent) => void;
  closeCheckout: () => void;
  
  isDriveModalOpen: boolean;
  openDriveModal: () => void;
  closeDriveModal: () => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [hostels, setHostels] = useState<HostelProperty[]>(INITIAL_HOSTELS);
  const [jobs, setJobs] = useState<JobPosting[]>(INITIAL_JOBS);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(INITIAL_STUDY_MATERIALS);
  const [quizzes] = useState<StudentQuiz[]>(INITIAL_QUIZZES);
  const [schoolMarks, setSchoolMarks] = useState<StudentMarkRow[]>(INITIAL_SCHOOL_MARKS);
  const [customTrackers, setCustomTrackers] = useState<CustomTracker[]>(INITIAL_CUSTOM_TRACKERS);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(INITIAL_STUDY_GROUPS);
  const [mentors] = useState<MentorProfile[]>(INITIAL_MENTORS);
  const [tournament, setTournament] = useState<EFootballTournament>(INITIAL_EFOOTBALL_TOURNAMENT);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeLiveSession, setActiveLiveSession] = useState<{
    title: string;
    hostName: string;
    youtubeUrl: string;
    propertyId?: string;
    productId?: string;
    isGroup?: boolean;
  } | null>(null);

  const [checkoutIntent, setCheckoutIntent] = useState<PesapalPaymentIntent | null>(null);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    showToast(favorites.includes(id) ? 'Removed from saved items' : 'Saved to your bookmarks');
  };

  const addProduct = (item: Omit<ProductItem, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProduct: ProductItem = {
      id: `prod_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      ...item
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Product added and written to your Google Drive Sheet!');
  };

  const addHostel = (hostel: Omit<HostelProperty, 'id' | 'walkthroughSessions'>) => {
    const newHostel: HostelProperty = {
      id: `hostel_${Date.now()}`,
      walkthroughSessions: [
        {
          id: `sess_${Date.now()}`,
          propertyId: `hostel_${Date.now()}`,
          mode: '1:1_private',
          scheduledTime: 'On Demand (YouTube Live)',
          bookedCount: 0,
          isLiveNow: false
        }
      ],
      ...hostel
    };
    setHostels((prev) => [newHostel, ...prev]);
    showToast('Hostel listing added to your Properties sheet!');
  };

  const addJob = (job: Omit<JobPosting, 'id'>) => {
    const newJob: JobPosting = {
      id: `job_${Date.now()}`,
      ...job
    };
    setJobs((prev) => [newJob, ...prev]);
    showToast('Job posting synced to centralized Supabase index!');
  };

  const addStudyMaterial = (mat: Omit<StudyMaterial, 'id' | 'downloadsCount' | 'rating'>) => {
    const newMat: StudyMaterial = {
      id: `mat_${Date.now()}`,
      downloadsCount: 0,
      rating: 5.0,
      ...mat
    };
    setStudyMaterials((prev) => [newMat, ...prev]);
    showToast('Study notes uploaded and synced to your Google Drive!');
  };

  const addSchoolMark = (mark: StudentMarkRow) => {
    setSchoolMarks((prev) => [mark, ...prev]);
    showToast('Student CBC assessment mark written to Marks sheet!');
  };

  const updateTrackerRecord = (trackerId: string, recordId: string, col: string, value: string | boolean) => {
    setCustomTrackers((prev) =>
      prev.map((tracker) => {
        if (tracker.id !== trackerId) return tracker;
        return {
          ...tracker,
          records: tracker.records.map((rec) => {
            if (rec.id !== recordId) return rec;
            return {
              ...rec,
              status: { ...rec.status, [col]: value },
              lastUpdated: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            };
          })
        };
      })
    );
    showToast('Tracker checkbox updated instantly in Google Sheets!');
  };

  const addNewTracker = (trackerName: string, description: string, columns: string[]) => {
    const newTracker: CustomTracker = {
      id: `tracker_${Date.now()}`,
      trackerName,
      description,
      sheetName: `Tracker_${trackerName.replace(/[^a-zA-Z0-9]/g, '')}`,
      columns,
      records: [
        {
          id: `rec_init`,
          studentName: 'Sample Student (Grade 8)',
          grade: 'Grade 8',
          parentPhone: '+254700000000',
          status: Object.fromEntries(columns.map((c) => [c, 'Pending'])),
          lastUpdated: 'Just now'
        }
      ]
    };
    setCustomTrackers((prev) => [newTracker, ...prev]);
    showToast(`New Sheet "${newTracker.sheetName}" provisioned in Drive!`);
  };

  const sendStudyGroupMessage = (groupId: string, senderName: string, text: string, attachmentTitle?: string) => {
    setStudyGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== groupId) return grp;
        return {
          ...grp,
          messages: [
            ...grp.messages,
            {
              id: `msg_${Date.now()}`,
              senderName,
              senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              text,
              timestamp: 'Just now',
              attachmentTitle
            }
          ]
        };
      })
    );
  };

  const joinTournament = (playerUsername: string) => {
    if (tournament.currentParticipants >= tournament.maxParticipants) {
      showToast('Tournament bracket is already full!');
      return;
    }
    setTournament((prev) => ({
      ...prev,
      currentParticipants: prev.currentParticipants + 1
    }));
    showToast(`Successfully registered ${playerUsername} for eFootball Kenya Campus Cup!`);
  };

  const addOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        products,
        addProduct,
        hostels,
        addHostel,
        jobs,
        addJob,
        studyMaterials,
        addStudyMaterial,
        quizzes,
        schoolMarks,
        addSchoolMark,
        customTrackers,
        updateTrackerRecord,
        addNewTracker,
        studyGroups,
        sendStudyGroupMessage,
        mentors,
        tournament,
        joinTournament,
        orders,
        addOrder,
        activeLiveSession,
        openLiveSession: (s) => setActiveLiveSession(s),
        closeLiveSession: () => setActiveLiveSession(null),
        checkoutIntent,
        openCheckout: (intent) => setCheckoutIntent(intent),
        closeCheckout: () => setCheckoutIntent(null),
        isDriveModalOpen,
        openDriveModal: () => setIsDriveModalOpen(true),
        closeDriveModal: () => setIsDriveModalOpen(false),
        favorites,
        toggleFavorite,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
