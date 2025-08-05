import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { syllabusData, type SubjectKey } from "@/lib/syllabus-data";

interface SubjectChecklistProps {
  subject: SubjectKey;
  progress: Record<string, boolean>;
  onTopicChange: (subject: SubjectKey, chapter: string, topic: string, completed: boolean) => void;
  icon: React.ReactNode;
  color: string;
}

export default function SubjectChecklist({ 
  subject, 
  progress, 
  onTopicChange, 
  icon, 
  color 
}: SubjectChecklistProps) {
  const [openChapters, setOpenChapters] = useState<Set<number>>(new Set());

  const toggleChapter = (chapterIndex: number) => {
    const newOpenChapters = new Set(openChapters);
    if (newOpenChapters.has(chapterIndex)) {
      newOpenChapters.delete(chapterIndex);
    } else {
      newOpenChapters.add(chapterIndex);
    }
    setOpenChapters(newOpenChapters);
  };

  const getChapterProgress = (chapter: any) => {
    const completedTopics = chapter.topics.filter((topic: string) => 
      progress[`${chapter.chapter}-${topic}`]
    ).length;
    return { completed: completedTopics, total: chapter.topics.length };
  };

  return (
    <div className="glassmorphism rounded-2xl p-6 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className={color}>{icon}</span>
          {subject.charAt(0).toUpperCase() + subject.slice(1)}
        </h3>
        <span className="text-sm text-gray-300">
          {syllabusData[subject].length} Chapters
        </span>
      </div>
      
      <div className="max-h-80 overflow-y-auto space-y-2 custom-scrollbar">
        {syllabusData[subject].map((chapter, chapterIndex) => {
          const chapterProgress = getChapterProgress(chapter);
          const isOpen = openChapters.has(chapterIndex);
          
          return (
            <Collapsible key={chapterIndex}>
              <div className="bg-white/10 rounded-lg p-3">
                <CollapsibleTrigger
                  onClick={() => toggleChapter(chapterIndex)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-gray-300" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    )}
                    <h4 className="font-semibold text-white text-sm">
                      {chapter.chapter}
                    </h4>
                  </div>
                  <span className="text-xs text-gray-300">
                    {chapterProgress.completed}/{chapterProgress.total}
                  </span>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2 space-y-1">
                  {chapter.topics.map((topic, topicIndex) => {
                    const topicKey = `${chapter.chapter}-${topic}`;
                    const isCompleted = progress[topicKey] || false;
                    
                    return (
                      <div key={topicIndex} className="flex items-center gap-2 text-sm text-gray-300 ml-6">
                        <Checkbox
                          id={`${subject}-${chapterIndex}-${topicIndex}`}
                          checked={isCompleted}
                          onCheckedChange={(checked) => 
                            onTopicChange(subject, chapter.chapter, topic, !!checked)
                          }
                          className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <label
                          htmlFor={`${subject}-${chapterIndex}-${topicIndex}`}
                          className="cursor-pointer hover:text-white transition-colors flex-1"
                        >
                          {topic}
                        </label>
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
