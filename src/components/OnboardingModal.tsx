/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  GraduationCap,
  PlusCircle,
  X,
  Check,
  Globe,
  Building,
  MapPin,
  BookOpen,
  Calendar,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useCurrency } from '../context/CurrencyContext.js';
import { api } from '../services/api.js';
import {
  Institution,
  Campus,
  CollegeOrFaculty,
  Department,
  Course,
  YearLevel,
  CountryInfo,
  InstitutionType,
} from '../types/index.js';
import { AddInstitutionModal } from './AddInstitutionModal.js';
import { ENERMIND_LOGO_URL } from './Preloader.js';

const YEAR_LEVELS: YearLevel[] = [
  { id: 'yr-1', label: 'Year 1 / Freshman', order: 1 },
  { id: 'yr-2', label: 'Year 2 / Sophomore', order: 2 },
  { id: 'yr-3', label: 'Year 3 / Junior', order: 3 },
  { id: 'yr-4', label: 'Year 4 / Senior', order: 4 },
  { id: 'yr-5', label: 'Year 5 / Final Year', order: 5 },
  { id: 'yr-grad', label: 'Graduate / Master', order: 6 },
  { id: 'yr-phd', label: 'Postgraduate / PhD', order: 7 },
  { id: 'yr-other', label: 'Diploma / Certificate / Other', order: 8 },
];

export function OnboardingModal() {
  const { user, isOnboardingOpen, closeOnboarding, updateUserProfile } = useAuth();
  const { setCurrency } = useCurrency();

  // Current Step: 1 to 9
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Global Data
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Selections
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('KE');
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<CollegeOrFaculty | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [customCourseName, setCustomCourseName] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<YearLevel | null>(YEAR_LEVELS[0]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  // Filters & Search
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [instSearch, setInstSearch] = useState<string>('');
  const [instTypeFilter, setInstTypeFilter] = useState<string>('ALL');

  // Add Missing Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalMode, setAddModalMode] = useState<'INSTITUTION' | 'CAMPUS'>('INSTITUTION');

  const [isSaving, setIsSaving] = useState(false);

  // Load countries on mount
  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await api.getCountries();
        setCountries(res.countries || []);
      } catch (err) {
        console.error('Failed to load countries:', err);
      }
    }
    loadCountries();
  }, []);

  // Load institutions when country changes
  useEffect(() => {
    if (!isOnboardingOpen) return;
    loadInstitutions(selectedCountryCode);
  }, [selectedCountryCode, isOnboardingOpen]);

  async function loadInstitutions(countryCode: string) {
    try {
      setIsDataLoading(true);
      const data = await api.getInstitutions(countryCode);
      const list = data.institutions || [];
      setInstitutions(list);

      if (list.length > 0) {
        selectInstitution(list[0]);
      } else {
        setSelectedInst(null);
        setSelectedCampus(null);
        setSelectedCollege(null);
        setSelectedDept(null);
        setSelectedCourse(null);
      }
    } catch (err) {
      console.error('Failed to load institutions:', err);
    } finally {
      setIsDataLoading(false);
    }
  }

  function handleSelectCountry(c: CountryInfo) {
    setSelectedCountryCode(c.code);
    setSelectedCurrency(c.currency || 'USD');
    setCurrentStep(2);
  }

  function selectInstitution(inst: Institution) {
    setSelectedInst(inst);
    const mainCampus = inst.campuses?.find((c) => c.isMainCampus) || inst.campuses?.[0] || null;
    setSelectedCampus(mainCampus);

    const firstCollege = mainCampus?.collegesOrFaculties?.[0] || null;
    setSelectedCollege(firstCollege);

    const firstDept = firstCollege?.departments?.[0] || null;
    setSelectedDept(firstDept);

    const firstCourse = firstDept?.courses?.[0] || null;
    setSelectedCourse(firstCourse);
  }

  function handleSelectCampus(campus: Campus) {
    setSelectedCampus(campus);
    const firstCollege = campus.collegesOrFaculties?.[0] || null;
    setSelectedCollege(firstCollege);
    const firstDept = firstCollege?.departments?.[0] || null;
    setSelectedDept(firstDept);
    const firstCourse = firstDept?.courses?.[0] || null;
    setSelectedCourse(firstCourse);
  }

  function handleSelectCollege(college: CollegeOrFaculty | null) {
    setSelectedCollege(college);
    const firstDept = college?.departments?.[0] || null;
    setSelectedDept(firstDept);
    const firstCourse = firstDept?.courses?.[0] || null;
    setSelectedCourse(firstCourse);
  }

  function handleSelectDept(dept: Department | null) {
    setSelectedDept(dept);
    const firstCourse = dept?.courses?.[0] || null;
    setSelectedCourse(firstCourse);
  }

  async function handleFinishOnboarding() {
    try {
      setIsSaving(true);

      const courseName = selectedCourse?.title || customCourseName.trim() || 'General Academic Studies';

      await updateUserProfile({
        countryCode: selectedCountryCode,
        preferredCurrency: selectedCurrency,
        institutionId: selectedInst?.id,
        institutionName: selectedInst?.name,
        campusId: selectedCampus?.id,
        campusName: selectedCampus?.name,
        collegeId: selectedCollege?.id,
        collegeName: selectedCollege?.name,
        departmentId: selectedDept?.id,
        departmentName: selectedDept?.name,
        courseId: selectedCourse?.id || 'course-custom',
        courseName,
        yearLevelId: selectedYear?.id,
        yearLevelLabel: selectedYear?.label,
        onboardingCompleted: true,
        onboardingStatus: 'COMPLETED',
      });

      setCurrency(selectedCurrency);
      closeOnboarding();
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOnboardingOpen) return null;

  // Filtered countries
  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.region.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Filtered institutions
  const filteredInstitutions = institutions.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(instSearch.toLowerCase()) ||
      inst.shortName?.toLowerCase().includes(instSearch.toLowerCase());
    const matchesType = instTypeFilter === 'ALL' || inst.type === instTypeFilter;
    return matchesSearch && matchesType;
  });

  const selectedCountryObj = countries.find((c) => c.code === selectedCountryCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B10]/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#12141D] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header with Circular Logo & Step Indicators */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            {/* Always Circular Logo with glowing ring */}
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#50E3C2]/30 p-0.5 bg-[#0A0B10] flex items-center justify-center shadow-[0_0_12px_rgba(80,227,194,0.2)]">
              <img
                src={ENERMIND_LOGO_URL}
                alt="Enermind"
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Campus Workspace Setup</h2>
              <p className="text-[11px] text-[#50E3C2]">
                Step {currentStep} of 9 — {getStepTitle(currentStep)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/40">
              {Math.round((currentStep / 9) * 100)}%
            </span>
            <button
              onClick={closeOnboarding}
              className="p-1.5 text-white/40 hover:text-white rounded-lg bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden shrink-0">
          <div
            className="bg-[#50E3C2] h-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 9) * 100}%` }}
          />
        </div>

        {/* Step Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-4">
          
          {/* STEP 1: SELECT COUNTRY */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Select Your Country / Region</h3>
                  <p className="text-xs text-white/40">Choose the country where your campus is located</p>
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search 40+ countries by name or code..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full bg-[#181B26] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredCountries.map((c) => {
                  const isSelected = selectedCountryCode === c.code;
                  return (
                    <button
                      key={c.code}
                      onClick={() => handleSelectCountry(c)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-[#50E3C2]/15 border-[#50E3C2] text-white shadow-lg'
                          : 'bg-[#181B26]/60 border-white/5 text-white/70 hover:border-white/20 hover:bg-[#181B26]'
                      }`}
                    >
                      <span className="text-2xl">{c.flagEmoji}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{c.name}</div>
                        <div className="text-[10px] text-white/40 font-mono">
                          {c.currency} • {c.code}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT INSTITUTION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">Select Your Institution</h3>
                  <p className="text-xs text-white/40">
                    Showing universities & colleges in {selectedCountryObj?.name || selectedCountryCode}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAddModalMode('INSTITUTION');
                    setIsAddModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#50E3C2]/10 border border-[#50E3C2]/30 text-[#50E3C2] text-xs rounded-xl hover:bg-[#50E3C2]/20 transition-colors shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add Missing Institution</span>
                </button>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search university name or short code..."
                    value={instSearch}
                    onChange={(e) => setInstSearch(e.target.value)}
                    className="w-full bg-[#181B26] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#50E3C2]/50"
                  />
                </div>

                <select
                  value={instTypeFilter}
                  onChange={(e) => setInstTypeFilter(e.target.value)}
                  className="bg-[#181B26] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                >
                  <option value="ALL">All Types</option>
                  <option value={InstitutionType.UNIVERSITY}>University</option>
                  <option value={InstitutionType.COLLEGE}>College</option>
                  <option value={InstitutionType.TECHNICAL_INSTITUTION}>Technical</option>
                  <option value={InstitutionType.VOCATIONAL_INSTITUTION}>Vocational</option>
                </select>
              </div>

              {isDataLoading ? (
                <div className="text-center py-8 text-xs text-white/40">Loading institutions...</div>
              ) : filteredInstitutions.length === 0 ? (
                <div className="text-center py-8 bg-[#181B26]/40 border border-white/5 rounded-2xl p-6 space-y-3">
                  <Building className="w-8 h-8 text-white/20 mx-auto" />
                  <p className="text-xs text-white/60">No institutions found matching your search.</p>
                  <button
                    onClick={() => {
                      setAddModalMode('INSTITUTION');
                      setIsAddModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#50E3C2] text-[#0A0B10] font-semibold text-xs rounded-xl hover:bg-[#40C9AB] transition-colors inline-flex items-center gap-2"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Propose "{instSearch || 'My University'}"</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredInstitutions.map((inst) => {
                    const isSelected = selectedInst?.id === inst.id;
                    return (
                      <button
                        key={inst.id}
                        onClick={() => selectInstitution(inst)}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#50E3C2]/15 border-[#50E3C2] text-white shadow-lg'
                            : 'bg-[#181B26]/60 border-white/5 text-white/70 hover:border-white/20 hover:bg-[#181B26]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#50E3C2] font-bold text-xs shrink-0">
                            {inst.shortName?.slice(0, 3) || inst.name.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate text-white">{inst.name}</div>
                            <div className="text-[11px] text-white/40 flex items-center gap-2">
                              <span>{inst.campuses.length} Campuses</span>
                              {inst.shortName && <span>• ({inst.shortName})</span>}
                              {inst.status === 'PENDING' && (
                                <span className="text-amber-400 font-mono text-[9px] bg-amber-400/10 px-1.5 py-0.5 rounded">
                                  Pending Review
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-[#50E3C2] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SELECT CAMPUS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Select Campus</h3>
                  <p className="text-xs text-white/40">
                    Campuses for {selectedInst?.name || 'Selected Institution'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAddModalMode('CAMPUS');
                    setIsAddModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#50E3C2]/10 border border-[#50E3C2]/30 text-[#50E3C2] text-xs rounded-xl hover:bg-[#50E3C2]/20 transition-colors shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add Campus</span>
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {selectedInst?.campuses.map((campus) => {
                  const isSelected = selectedCampus?.id === campus.id;
                  return (
                    <button
                      key={campus.id}
                      onClick={() => handleSelectCampus(campus)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#50E3C2]/15 border-[#50E3C2] text-white shadow-lg'
                          : 'bg-[#181B26]/60 border-white/5 text-white/70 hover:border-white/20 hover:bg-[#181B26]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#50E3C2] shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white">{campus.name}</div>
                          <div className="text-[11px] text-white/40">{campus.city} {campus.isMainCampus && '• Primary Campus'}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#50E3C2] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: SELECT COLLEGE / FACULTY */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Select Faculty or College</h3>
                <p className="text-xs text-white/40">Optional — choose your academic faculty or skip</p>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                <button
                  onClick={() => handleSelectCollege(null)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedCollege === null
                      ? 'bg-[#50E3C2]/15 border-[#50E3C2] text-white'
                      : 'bg-[#181B26]/60 border-white/5 text-white/70 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-white">General / Not Applicable</div>
                    <div className="text-[11px] text-white/40">Skip faculty selection</div>
                  </div>
                  {selectedCollege === null && <Check className="w-4 h-4 text-[#50E3C2]" />}
                </button>

                {selectedCampus?.collegesOrFaculties.map((col) => {
                  const isSelected = selectedCollege?.id === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => handleSelectCollege(col)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#50E3C2]/15 border-[#50E3C2] text-white'
                          : 'bg-[#181B26]/60 border-white/5 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">{col.name}</div>
                        <div className="text-[11px] text-white/40">{col.departments?.length || 0} Departments</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#50E3C2]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: SELECT DEPARTMENT */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Select Department</h3>
                <p className="text-xs text-white/40">Optional — choose your department or skip</p>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                <button
                  onClick={() => handleSelectDept(null)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedDept === null
                      ? 'bg-[#50E3C2]/15 border-[#50E3C2] text-white'
                      : 'bg-[#181B26]/60 border-white/5 text-white/70 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-white">General / Not Applicable</div>
                    <div className="text-[11px] text-white/40">Skip department selection</div>
                  </div>
                  {selectedDept === null && <Check className="w-4 h-4 text-[#50E3C2]" />}
                </button>

                {selectedCollege?.departments?.map((dept) => {
                  const isSelected = selectedDept?.id === dept.id;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => handleSelectDept(dept)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#50E3C2]/15 border-[#50E3C2] text-white'
                          : 'bg-[#181B26]/60 border-white/5 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">{dept.name}</div>
                        <div className="text-[11px] text-white/40">{dept.courses?.length || 0} Programs</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#50E3C2]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: SELECT COURSE / PROGRAM */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Select Course / Program of Study</h3>
                <p className="text-xs text-white/40">Choose from available catalog or type your exact degree</p>
              </div>

              {selectedDept?.courses && selectedDept.courses.length > 0 && (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedDept.courses.map((course) => {
                    const isSelected = selectedCourse?.id === course.id && !customCourseName;
                    return (
                      <button
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course);
                          setCustomCourseName('');
                        }}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#50E3C2]/15 border-[#50E3C2] text-white'
                            : 'bg-[#181B26]/60 border-white/5 text-white/70 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">{course.title}</div>
                          <div className="text-[10px] text-white/40 font-mono">{course.code} • {course.degreeType}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#50E3C2]" />}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="pt-2">
                <label className="block text-xs text-white/70 mb-1.5 font-medium">Or Enter Custom Degree / Program:</label>
                <input
                  type="text"
                  placeholder="e.g. BSc Software Engineering & AI"
                  value={customCourseName}
                  onChange={(e) => {
                    setCustomCourseName(e.target.value);
                    if (e.target.value) setSelectedCourse(null);
                  }}
                  className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
            </div>
          )}

          {/* STEP 7: SELECT YEAR / LEVEL */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Select Your Current Academic Year / Level</h3>
                <p className="text-xs text-white/40">This personalizes your past papers and campus feeds</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {YEAR_LEVELS.map((yr) => {
                  const isSelected = selectedYear?.id === yr.id;
                  return (
                    <button
                      key={yr.id}
                      onClick={() => setSelectedYear(yr)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#50E3C2]/15 border-[#50E3C2] text-white shadow-lg'
                          : 'bg-[#181B26]/60 border-white/5 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-[#50E3C2]" />
                        <span className="text-xs font-semibold">{yr.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#50E3C2]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: PREFERRED CURRENCY */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Preferred Currency</h3>
                <p className="text-xs text-white/40">
                  Auto-suggested from {selectedCountryObj?.name || 'country'}. Used for Marketplace, Gigs, and Sheets.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { code: 'USD', name: 'US Dollar', symbol: '$' },
                  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
                  { code: 'GBP', name: 'British Pound', symbol: '£' },
                  { code: 'EUR', name: 'Euro', symbol: '€' },
                  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
                  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$' },
                  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
                  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
                  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
                ].map((cur) => {
                  const isSelected = selectedCurrency === cur.code;
                  return (
                    <button
                      key={cur.code}
                      onClick={() => setSelectedCurrency(cur.code)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#50E3C2]/15 border-[#50E3C2] text-white shadow-lg'
                          : 'bg-[#181B26]/60 border-white/5 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white font-mono">{cur.code} ({cur.symbol})</div>
                        <div className="text-[10px] text-white/40">{cur.name}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#50E3C2]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 9: CONFIRMATION & SUMMARY */}
          {currentStep === 9 && (
            <div className="space-y-4 text-xs">
              <div className="text-center py-2 space-y-1">
                <div className="w-12 h-12 rounded-full bg-[#50E3C2]/15 text-[#50E3C2] flex items-center justify-center mx-auto border border-[#50E3C2]/30 mb-2">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Your Campus Workspace is Ready!</h3>
                <p className="text-xs text-white/40">Review your profile details below before entering Enermind.</p>
              </div>

              <div className="bg-[#181B26]/70 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/5">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">Student Name</span>
                    <span className="text-xs font-semibold text-white">{user?.displayName || 'Student'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">Google Account</span>
                    <span className="text-xs font-semibold text-[#50E3C2]">{user?.email || 'Authenticated'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/5">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">Country</span>
                    <span className="text-xs font-medium text-white">
                      {selectedCountryObj?.flagEmoji} {selectedCountryObj?.name || selectedCountryCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">Currency</span>
                    <span className="text-xs font-mono font-medium text-white">{selectedCurrency}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">Institution & Campus</span>
                    <span className="text-xs font-semibold text-white">
                      {selectedInst?.name || 'Unspecified'} — {selectedCampus?.name || 'Main Campus'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">Program & Year</span>
                    <span className="text-xs font-medium text-white">
                      {selectedCourse?.title || customCourseName || 'General Studies'} • {selectedYear?.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 shrink-0">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 text-xs font-medium text-white/60 hover:text-white rounded-xl bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 9 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={
                (currentStep === 2 && !selectedInst) ||
                (currentStep === 3 && !selectedCampus)
              }
              className="px-5 py-2 text-xs font-semibold bg-[#50E3C2] text-[#0A0B10] rounded-xl hover:bg-[#40C9AB] transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishOnboarding}
              disabled={isSaving}
              className="px-6 py-2.5 text-xs font-bold bg-[#50E3C2] text-[#0A0B10] rounded-xl hover:bg-[#40C9AB] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(80,227,194,0.3)] disabled:opacity-50"
            >
              <span>{isSaving ? 'Entering Workspace...' : 'Enter Enermind Campus'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Add Missing Institution / Campus Modal */}
      <AddInstitutionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mode={addModalMode}
        parentInstitution={selectedInst}
        countries={countries}
        onCreated={(newInst) => {
          setInstitutions((prev) => [newInst, ...prev]);
          selectInstitution(newInst);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}

function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return 'Country of Study';
    case 2:
      return 'Institution';
    case 3:
      return 'Campus';
    case 4:
      return 'Faculty / College (Optional)';
    case 5:
      return 'Department (Optional)';
    case 6:
      return 'Course / Program';
    case 7:
      return 'Academic Year';
    case 8:
      return 'Preferred Currency';
    case 9:
      return 'Confirmation';
    default:
      return 'Onboarding';
  }
}
