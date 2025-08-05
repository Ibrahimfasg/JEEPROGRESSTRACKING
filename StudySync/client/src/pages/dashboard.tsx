import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Eye, RotateCcw, Save, Check, Atom, FlaskConical, Calculator } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProgressRing from "@/components/progress-ring";
import SubjectChecklist from "@/components/subject-checklist";
import ComparativeChart from "@/components/comparative-chart";
import { syllabusData, type SubjectKey } from "@/lib/syllabus-data";
import type { User, ProgressData } from "@shared/schema";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [todayStudy, setTodayStudy] = useState("");
  const [isViewingPartner, setIsViewingPartner] = useState(false);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  // Fetch current user's progress
  const { data: progressData = [], isLoading: progressLoading } = useQuery<ProgressData[]>({
    queryKey: ['/api/progress', user.id],
    enabled: !!user.id
  });

  // Fetch all users for partner data
  const { data: allUsers = [] } = useQuery<User[]>({
    queryKey: ['/api/users']
  });

  // Fetch current user's daily study
  const { data: dailyStudyData } = useQuery<{ studyPlan: string }>({
    queryKey: ['/api/daily-study', user.id, today],
    enabled: !!user.id
  });

  // Get partner user
  const partner = allUsers.find((u) => u.id !== user.id);

  // Fetch partner's progress
  const { data: partnerProgressData = [] } = useQuery<ProgressData[]>({
    queryKey: ['/api/progress', partner?.id],
    enabled: !!partner?.id
  });

  // Fetch partner's daily study
  const { data: partnerDailyStudy } = useQuery<{ studyPlan: string }>({
    queryKey: ['/api/daily-study', partner?.id, today],
    enabled: !!partner?.id
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { userId: string; subject: string; topicProgress: Record<string, boolean> }) => {
      const response = await apiRequest('POST', '/api/progress', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      toast({ title: "Progress updated successfully!" });
    }
  });

  // Update daily study mutation
  const updateDailyStudyMutation = useMutation({
    mutationFn: async (data: { userId: string; studyPlan: string; date: string }) => {
      const response = await apiRequest('POST', '/api/daily-study', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-study'] });
      toast({ title: "Study plan saved!" });
    }
  });

  // Initialize today's study plan
  useEffect(() => {
    if (dailyStudyData?.studyPlan) {
      setTodayStudy(dailyStudyData.studyPlan);
    }
  }, [dailyStudyData]);

  // Get progress for a subject
  const getSubjectProgress = (subject: SubjectKey, progressDataArray: ProgressData[] = progressData): Record<string, boolean> => {
    const subjectData = progressDataArray.find(p => p.subject === subject);
    return subjectData?.topicProgress || {};
  };

  // Calculate subject percentage
  const calculateSubjectPercentage = (subject: SubjectKey, progressDataArray: ProgressData[] = progressData): number => {
    const progress = getSubjectProgress(subject, progressDataArray);
    const totalTopics = syllabusData[subject].reduce((total, chapter) => total + chapter.topics.length, 0);
    const completedTopics = Object.values(progress).filter(Boolean).length;
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  };

  // Handle topic change
  const handleTopicChange = (subject: SubjectKey, chapter: string, topic: string, completed: boolean) => {
    const currentProgress = getSubjectProgress(subject);
    const updatedProgress = {
      ...currentProgress,
      [`${chapter}-${topic}`]: completed
    };

    updateProgressMutation.mutate({
      userId: user.id,
      subject,
      topicProgress: updatedProgress
    });
  };

  // Handle daily study update
  const handleUpdateDailyStudy = () => {
    updateDailyStudyMutation.mutate({
      userId: user.id,
      studyPlan: todayStudy,
      date: today
    });
  };

  // Calculate overall progress
  const physicsPercentage = calculateSubjectPercentage('physics');
  const chemistryPercentage = calculateSubjectPercentage('chemistry');
  const mathPercentage = calculateSubjectPercentage('mathematics');
  const overallPercentage = Math.round((physicsPercentage + chemistryPercentage + mathPercentage) / 3);

  // Calculate partner progress
  const partnerPhysicsPercentage = partner ? calculateSubjectPercentage('physics', partnerProgressData) : 0;
  const partnerChemistryPercentage = partner ? calculateSubjectPercentage('chemistry', partnerProgressData) : 0;
  const partnerMathPercentage = partner ? calculateSubjectPercentage('mathematics', partnerProgressData) : 0;

  const refreshProgress = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    toast({ title: "Progress refreshed!" });
  };

  const togglePartnerView = () => {
    if (!partner) return;
    
    const partnerOverall = Math.round((partnerPhysicsPercentage + partnerChemistryPercentage + partnerMathPercentage) / 3);
    
    toast({
      title: `${partner.displayName}'s Progress`,
      description: `Physics: ${partnerPhysicsPercentage}% | Chemistry: ${partnerChemistryPercentage}% | Math: ${partnerMathPercentage}% | Overall: ${partnerOverall}%`
    });
  };

  if (progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glassmorphism border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{user.avatar === 'boy' ? '👨‍🎓' : '👩‍🎓'}</div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.displayName}'s Dashboard</h1>
                <p className="text-gray-300 text-sm">JEE Class 11 Progress Tracker</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={togglePartnerView}
                className="bg-purple-500 hover:bg-purple-600 ripple"
                disabled={!partner}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Partner
              </Button>
              <Button
                onClick={onLogout}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Overall Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Overall Progress */}
          <div className="glassmorphism rounded-2xl p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
              <div className="text-2xl">📊</div>
            </div>
            <div className="flex justify-center">
              <ProgressRing percentage={overallPercentage} color="#3B82F6" />
            </div>
          </div>

          {/* Physics Progress */}
          <div className="glassmorphism rounded-2xl p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Physics</h3>
              <Atom className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex justify-center">
              <ProgressRing percentage={physicsPercentage} color="#3B82F6" />
            </div>
          </div>

          {/* Chemistry Progress */}
          <div className="glassmorphism rounded-2xl p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Chemistry</h3>
              <FlaskConical className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex justify-center">
              <ProgressRing percentage={chemistryPercentage} color="#10B981" />
            </div>
          </div>

          {/* Mathematics Progress */}
          <div className="glassmorphism rounded-2xl p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Mathematics</h3>
              <Calculator className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex justify-center">
              <ProgressRing percentage={mathPercentage} color="#8B5CF6" />
            </div>
          </div>
        </div>

        {/* Comparative Progress Chart */}
        <div className="glassmorphism rounded-2xl p-6 mb-8 hover-lift">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Comparative Progress</h3>
            <Button
              onClick={refreshProgress}
              className="bg-green-500 hover:bg-green-600 ripple"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Update Progress
            </Button>
          </div>
          {partner && (
            <ComparativeChart
              currentUserData={{
                physics: physicsPercentage,
                chemistry: chemistryPercentage,
                mathematics: mathPercentage
              }}
              partnerData={{
                physics: partnerPhysicsPercentage,
                chemistry: partnerChemistryPercentage,
                mathematics: partnerMathPercentage
              }}
              currentUserAvatar={user.avatar === 'boy' ? '👨‍🎓' : '👩‍🎓'}
              partnerAvatar={partner.avatar === 'boy' ? '👨‍🎓' : '👩‍🎓'}
              currentUserName={user.displayName}
              partnerName={partner.displayName}
            />
          )}
        </div>

        {/* Daily Study Update */}
        <div className="glassmorphism rounded-2xl p-6 mb-8 hover-lift">
          <h3 className="text-xl font-bold text-white mb-4">Today's Study Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Textarea
                value={todayStudy}
                onChange={(e) => setTodayStudy(e.target.value)}
                placeholder="What are you studying today?"
                className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-blue-400 resize-none h-32"
              />
              <Button
                onClick={handleUpdateDailyStudy}
                disabled={updateDailyStudyMutation.isPending}
                className="mt-3 bg-blue-500 hover:bg-blue-600 ripple"
              >
                {updateDailyStudyMutation.isPending ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Study Plan
                  </>
                )}
              </Button>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Partner's Study Plan</h4>
              <div className="bg-white/10 rounded-lg p-4 h-32 text-gray-300 overflow-y-auto">
                {partnerDailyStudy?.studyPlan || "No study plan set yet."}
              </div>
            </div>
          </div>
        </div>

        {/* Subject Checklists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SubjectChecklist
            subject="physics"
            progress={getSubjectProgress('physics')}
            onTopicChange={handleTopicChange}
            icon={<Atom className="w-6 h-6" />}
            color="text-blue-400"
          />
          <SubjectChecklist
            subject="chemistry"
            progress={getSubjectProgress('chemistry')}
            onTopicChange={handleTopicChange}
            icon={<FlaskConical className="w-6 h-6" />}
            color="text-green-400"
          />
          <SubjectChecklist
            subject="mathematics"
            progress={getSubjectProgress('mathematics')}
            onTopicChange={handleTopicChange}
            icon={<Calculator className="w-6 h-6" />}
            color="text-purple-400"
          />
        </div>
      </main>
    </div>
  );
}
