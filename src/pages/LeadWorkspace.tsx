import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  MoreVertical, 
  ChevronRight, 
  CheckCircle, 
  X, 
  PlusCircle, 
  MessageSquare, 
  ClipboardList,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';

// Complete pipeline stages as per documentation
const PIPELINE_STAGES = [
  'Yet to Assign', 
  'Yet to Contact', 
  'Contact Again', 
  'Not Interested', 
  'Planning Later', 
  'Yet to Decide', 
  'Irrelevant Lead', 
  'Registered for Session', 
  'Session Completed', 
  'Docs Submitted', 
  'Shortlisted Univ.', 
  'Application in Progress', 
  'Offer Letter Received',
  'Deposit Paid', 
  'Visa Received', 
  'Flight and Accommodation Booked', 
  'Tuition Fee Paid', 
  'Commission Received'
];

// Complete dropdown options as per documentation
const DROPDOWN_OPTIONS = {
  taskType: ['Call', 'Meet Done', 'Shortlisting', 'Application Process', 'Tracking', 'Submit Documents'],
  callType: ['Intro Call', 'Session Follow up call', 'Session Reminder Call', 'Followup Call'],
  connectStatus: ['Interested', 'Not Interested', 'Planning later', 'Yet to Decide', 'Irrelevant', 'DNP', 'Call back', 'Call Rejected', 'Other Preferred Language', 'Casual Follow-up', 'Session Scheduling'],
  country: ['USA', 'Canada', 'UK', 'Australia', 'Singapore', 'Germany', 'Ireland', 'New Zealand'],
  intake: ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026', 'Fall 2026'],
  prevConsultancy: ['Application Started', 'Offer Received', 'In Loan Process', "No, haven't started", 'Session Scheduled'],
  sessionStatus: ['Confirmed, Will attend', 'Rescheduled', 'Cancelled', 'Completed'],
  isRescheduled: ['Yes', 'No'],
  shortlistingInitiated: ['Requested In KC', 'Done by own'],
  shortlistingStatus: ['New Shortlisting', 'Add-on Shortlisting'],
  shortlistingFinalStatus: ['Sent to students', 'Yet to send'],
  applicationProcess: ['New Application Initiated at KC', 'Add-on Application Initiated at KC'],
  trackingStatus: ['Credentials logging', 'Application Status', 'Offer Letter Status', 'VISA Tracking'],
  applicationStatus: ['Application submitted to KC', 'Application submitted to university', 'Docs Pending', 'In Progress', 'Awaiting decision', 'Accepted', 'Rejected'],
  offerLetterStatus: ['Conditional', 'Unconditional'],
  visaStatus: ['Applied', 'In Process', 'Approved', 'Rejected'],
  depositStatus: ['Paid', 'Pending', 'Not Required'],
  tuitionStatus: ['Paid', 'Pending', 'Partial Payment'],
  commissionStatus: ['Received', 'Pending', 'Processing']
};

// Enhanced Task data interface
interface TaskData {
  taskType?: string;
  callType?: string;
  connectStatus?: string;
  country?: string;
  intake?: string;
  prevConsultancy?: string;
  sessionStatus?: string;
  sessionDate?: string;
  isRescheduled?: string;
  shortlistingInitiated?: string;
  shortlistingStatus?: string;
  finalStatus?: string;
  applicationProcess?: string;
  applicationCount?: string;
  trackingStatus?: string;
  applicationStatus?: string;
  offerLetterStatus?: string;
  visaStatus?: string;
  depositStatus?: string;
  tuitionStatus?: string;
  commissionStatus?: string;
  remarks?: string;
  universityName?: string;
  universityUrl?: string;
  username?: string;
  password?: string;
  reasonNotInterested?: string;
  preferredLanguage?: string;
  user?: string;
  date?: string;
}

// Mock lead data
const initialLeadData = {
  id: 'LD-001',
  name: 'Alice Johnson',
  email: 'alice.j@example.com',
  phone: '+1 234 567 890',
  currentStageIndex: 1,
  counselor: 'Sarah Miller',
  manager: 'John Doe',
  counselorPhone: '+1 987 654 3210',
  managerPhone: '+1 123 456 7890',
  source: 'Website Inquiry',
  created: '2023-10-26',
};

const stageHistory = [
  { stage: 'Yet to Assign', date: '2023-10-26', user: 'System' },
  { stage: 'Yet to Contact', date: '2023-10-26', user: 'Sarah Miller' },
];

const initialRemarks = [
  { remark: 'Initial inquiry from website.', date: '2023-10-26', user: 'System' },
];

// Enhanced stage progression logic based on documentation
const getNextStageFromTask = (taskData: TaskData, currentStage: string) => {
  const { taskType, connectStatus, finalStatus, applicationProcess, trackingStatus, offerLetterStatus, visaStatus, depositStatus, tuitionStatus, commissionStatus } = taskData;

  // Call task logic
  if (taskType === 'Call') {
    switch (connectStatus) {
      case 'DNP':
      case 'Call back':
      case 'Call Rejected':
        return 'Contact Again';
      case 'Not Interested':
        return 'Not Interested';
      case 'Planning later':
        return 'Planning Later';
      case 'Yet to Decide':
        return 'Yet to Decide';
      case 'Irrelevant':
        return 'Irrelevant Lead';
      case 'Session Scheduling':
        return 'Registered for Session';
      default:
        return null;
    }
  }

  // Meet Done task logic
  if (taskType === 'Meet Done') {
    switch (connectStatus) {
      case 'Interested':
        return 'Session Completed';
      case 'Not Interested':
        return 'Not Interested';
      case 'Planning later':
        return 'Planning Later';
      case 'Yet to Decide':
        return 'Yet to Decide';
      case 'Irrelevant':
        return 'Irrelevant Lead';
      case 'Session Scheduling':
        return 'Registered for Session';
      default:
        return null;
    }
  }

  // Submit Documents task
  if (taskType === 'Submit Documents') {
    return 'Docs Submitted';
  }

  // Shortlisting task logic
  if (taskType === 'Shortlisting' && finalStatus === 'Sent to students') {
    return 'Shortlisted Univ.';
  }

  // Application Process task logic
  if (taskType === 'Application Process') {
    return 'Application in Progress';
  }

  // Tracking task logic
  if (taskType === 'Tracking') {
    if (trackingStatus === 'Offer Letter Status' && offerLetterStatus) {
      return 'Offer Letter Received';
    }
    if (trackingStatus === 'VISA Tracking' && visaStatus === 'Approved') {
      return 'Visa Received';
    }
    if (depositStatus === 'Paid') {
      return 'Deposit Paid';
    }
    if (tuitionStatus === 'Paid') {
      return 'Tuition Fee Paid';
    }
    if (commissionStatus === 'Received') {
      return 'Commission Received';
    }
  }

  return null;
};

// Enhanced Task Composer Component
const TaskComposer = ({ onTaskComplete, currentStage }: { onTaskComplete: (taskData: TaskData, nextStage: string | null) => void; currentStage: string }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskData, setTaskData] = useState<TaskData>({});
  const [step, setStep] = useState(1);

  const handleInputChange = (name: string, value: string) => {
    setTaskData(prev => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setTaskData({});
    setStep(1);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => setIsTaskModalOpen(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextStage = getNextStageFromTask(taskData, currentStage);
    onTaskComplete(taskData, nextStage);
    handleCloseModal();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Select value={taskData.taskType || ''} onValueChange={(value) => { handleInputChange('taskType', value); setStep(2); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select Task Type..." />
              </SelectTrigger>
              <SelectContent>
                {DROPDOWN_OPTIONS.taskType.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 2:
        if (taskData.taskType === 'Call') {
          return (
            <div className="space-y-4">
              <Select value={taskData.callType || ''} onValueChange={(value) => { handleInputChange('callType', value); setStep(3); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Call Type..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.callType.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        
        if (taskData.taskType === 'Meet Done' || taskData.taskType === 'Call') {
          return (
            <div className="space-y-4">
              <Select value={taskData.connectStatus || ''} onValueChange={(value) => { 
                handleInputChange('connectStatus', value); 
                if (value === 'Interested') setStep(4);
                else if (['Not Interested', 'Planning later', 'Yet to Decide'].includes(value)) setStep(5);
                else setStep(6);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Connect Status..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.connectStatus.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        if (taskData.taskType === 'Submit Documents') {
          return (
            <div className="space-y-4">
              <Textarea 
                placeholder="Add remarks about document submission..."
                value={taskData.remarks || ''}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
              />
              <Button type="submit" className="w-full">Save Task & Update Stage</Button>
            </div>
          );
        }

        if (taskData.taskType === 'Shortlisting') {
          return (
            <div className="space-y-4">
              <Select value={taskData.shortlistingInitiated || ''} onValueChange={(value) => handleInputChange('shortlistingInitiated', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Shortlisting Initiated..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.shortlistingInitiated.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={taskData.shortlistingStatus || ''} onValueChange={(value) => handleInputChange('shortlistingStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Shortlisting Status..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.shortlistingStatus.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={taskData.country || ''} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.country.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={taskData.intake || ''} onValueChange={(value) => handleInputChange('intake', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Intake..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.intake.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={taskData.finalStatus || ''} onValueChange={(value) => handleInputChange('finalStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Final Status..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.shortlistingFinalStatus.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Save Task & Update Stage</Button>
            </div>
          );
        }

        if (taskData.taskType === 'Application Process') {
          return (
            <div className="space-y-4">
              <Select value={taskData.applicationProcess || ''} onValueChange={(value) => handleInputChange('applicationProcess', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Application Process..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.applicationProcess.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="How many applications submitted to KC?"
                value={taskData.applicationCount || ''}
                onChange={(e) => handleInputChange('applicationCount', e.target.value)}
              />
              <Button type="submit" className="w-full">Save Task & Update Stage</Button>
            </div>
          );
        }

        if (taskData.taskType === 'Tracking') {
          return (
            <div className="space-y-4">
              <Select value={taskData.trackingStatus || ''} onValueChange={(value) => { 
                handleInputChange('trackingStatus', value); 
                setStep(7);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Tracking Status..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.trackingStatus.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        return <p>Please select a task type to continue.</p>;

      case 4: // Interested flow
        return (
          <div className="space-y-4">
            <Select value={taskData.country || ''} onValueChange={(value) => handleInputChange('country', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country..." />
              </SelectTrigger>
              <SelectContent>
                {DROPDOWN_OPTIONS.country.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={taskData.intake || ''} onValueChange={(value) => handleInputChange('intake', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Planning Intake..." />
              </SelectTrigger>
              <SelectContent>
                {DROPDOWN_OPTIONS.intake.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={taskData.prevConsultancy || ''} onValueChange={(value) => handleInputChange('prevConsultancy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Previous Consultancy..." />
              </SelectTrigger>
              <SelectContent>
                {DROPDOWN_OPTIONS.prevConsultancy.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setStep(6)} className="w-full">Continue</Button>
          </div>
        );

      case 5: // Not Interested/Planning Later/Yet to Decide flow
        return (
          <div className="space-y-4">
            {taskData.connectStatus === 'Not Interested' && (
              <Textarea
                placeholder="Reason for not being interested..."
                value={taskData.reasonNotInterested || ''}
                onChange={(e) => handleInputChange('reasonNotInterested', e.target.value)}
              />
            )}
            {taskData.connectStatus === 'Other Preferred Language' && (
              <Input
                placeholder="Preferred language..."
                value={taskData.preferredLanguage || ''}
                onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
              />
            )}
            <Button onClick={() => setStep(6)} className="w-full">Continue</Button>
          </div>
        );

      case 6: // Final remarks step
        return (
          <div className="space-y-4">
            <Textarea 
              placeholder="Add remarks (optional)..."
              value={taskData.remarks || ''}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
            />
            <Button type="submit" className="w-full">Save Task</Button>
          </div>
        );

      case 7: // Tracking specific fields
        if (taskData.trackingStatus === 'Credentials logging') {
          return (
            <div className="space-y-4">
              <Input
                placeholder="University Name"
                value={taskData.universityName || ''}
                onChange={(e) => handleInputChange('universityName', e.target.value)}
              />
              <Input
                placeholder="University URL"
                value={taskData.universityUrl || ''}
                onChange={(e) => handleInputChange('universityUrl', e.target.value)}
              />
              <Input
                placeholder="Username"
                value={taskData.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={taskData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <Button type="submit" className="w-full">Save Task</Button>
            </div>
          );
        }

        if (taskData.trackingStatus === 'Application Status') {
          return (
            <div className="space-y-4">
              <Input
                placeholder="Number of applications being tracked"
                value={taskData.applicationCount || ''}
                onChange={(e) => handleInputChange('applicationCount', e.target.value)}
              />
              <Select value={taskData.applicationStatus || ''} onValueChange={(value) => handleInputChange('applicationStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Application Status..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.applicationStatus.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Save Task</Button>
            </div>
          );
        }

        if (taskData.trackingStatus === 'Offer Letter Status') {
          return (
            <div className="space-y-4">
              <Select value={taskData.offerLetterStatus || ''} onValueChange={(value) => handleInputChange('offerLetterStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Offer Letter Status..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.offerLetterStatus.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Save Task</Button>
            </div>
          );
        }

        if (taskData.trackingStatus === 'VISA Tracking') {
          return (
            <div className="space-y-4">
              <Select value={taskData.visaStatus || ''} onValueChange={(value) => handleInputChange('visaStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select VISA Status..." />
                </SelectTrigger>
                <SelectContent>
                  {DROPDOWN_OPTIONS.visaStatus.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Save Task</Button>
            </div>
          );
        }

        return <Button type="submit" className="w-full">Save Task</Button>;

      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Task Composer</h3>
          <p className="text-sm text-muted-foreground">Log calls, schedule meetings, and manage application tasks to automatically advance the lead's stage.</p>
        </div>
        <Button onClick={handleOpenModal} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Create Task
        </Button>
      </div>

      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background w-full max-w-lg p-6 rounded-lg shadow-xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Task</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderStep()}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Lead Data Card Component
const LeadDataCard = ({ lead, lastTask }: { lead: typeof initialLeadData; lastTask: TaskData | null }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 pb-1 border-b">Personal Data</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p><span className="font-medium">Lead ID:</span> {lead.id}</p>
            <p><span className="font-medium">Source:</span> {lead.source}</p>
            <p><span className="font-medium">Name:</span> {lead.name}</p>
            <p><span className="font-medium">Created:</span> {lead.created}</p>
            <p><span className="font-medium">Email:</span> {lead.email}</p>
            <p><span className="font-medium">Phone:</span> {lead.phone}</p>
          </div>
        </div>
        {lastTask && (
          <div>
            <h4 className="font-semibold mb-2 mt-4 pb-1 border-b">Last Task Details</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><span className="font-medium">Task Type:</span> {lastTask.taskType}</p>
              {lastTask.callType && <p><span className="font-medium">Call Type:</span> {lastTask.callType}</p>}
              {lastTask.connectStatus && <p><span className="font-medium">Connect Status:</span> {lastTask.connectStatus}</p>}
              {lastTask.country && <p><span className="font-medium">Country:</span> {lastTask.country}</p>}
              {lastTask.intake && <p><span className="font-medium">Intake:</span> {lastTask.intake}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Admin Stage Manager Component
const AdminStageManager = ({ 
  lead, 
  onStageChange, 
  isOpen, 
  onClose 
}: { 
  lead: typeof initialLeadData; 
  onStageChange: (newStageIndex: number, reason: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState(lead.currentStageIndex);
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (selectedStageIndex !== lead.currentStageIndex && reason.trim()) {
      onStageChange(selectedStageIndex, reason);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background w-full max-w-md p-6 rounded-lg shadow-xl m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Admin: Change Stage</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Current Stage</p>
            <Badge variant="outline">{PIPELINE_STAGES[lead.currentStageIndex]}</Badge>
          </div>
          
          <div>
            <label className="text-sm font-medium">New Stage</label>
            <Select value={selectedStageIndex.toString()} onValueChange={(value) => setSelectedStageIndex(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PIPELINE_STAGES.map((stage, index) => (
                  <SelectItem key={index} value={index.toString()}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Reason for Change</label>
            <Textarea
              placeholder="Provide a reason for this manual stage change..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleConfirm}
              disabled={selectedStageIndex === lead.currentStageIndex || !reason.trim()}
            >
              Change Stage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadWorkspace = () => {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const [lead, setLead] = useState(initialLeadData);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isAdminStageModalOpen, setIsAdminStageModalOpen] = useState(false);
  const [history, setHistory] = useState(stageHistory);
  const [remarks, setRemarks] = useState(initialRemarks);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [universityApps, setUniversityApps] = useState<Array<{name: string; url: string; username: string; password: string}>>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});

  // Check if current user is admin
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'admin';

  const togglePasswordVisibility = (index: number) => {
    setVisiblePasswords(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const currentStage = PIPELINE_STAGES[lead.currentStageIndex];
  const nextManualStage = PIPELINE_STAGES[lead.currentStageIndex + 1];
  const isFinalStage = lead.currentStageIndex >= PIPELINE_STAGES.length - 1;
  const progressPercentage = ((lead.currentStageIndex + 1) / PIPELINE_STAGES.length) * 100;

  const handleOpenStageModal = () => !isFinalStage && setIsStageModalOpen(true);
  const handleCloseStageModal = () => setIsStageModalOpen(false);

  const handleConfirmStageMove = () => {
    const newStageIndex = lead.currentStageIndex + 1;
    setLead(prev => ({ ...prev, currentStageIndex: newStageIndex }));
    setHistory(prev => [...prev, { 
      stage: PIPELINE_STAGES[newStageIndex], 
      date: new Date().toISOString().split('T')[0], 
      user: 'Sarah Miller (Manual)' 
    }]);
    handleCloseStageModal();
  };

  const handleAdminStageChange = (newStageIndex: number, reason: string) => {
    setLead(prev => ({ ...prev, currentStageIndex: newStageIndex }));
    setHistory(prev => [...prev, { 
      stage: PIPELINE_STAGES[newStageIndex], 
      date: new Date().toISOString().split('T')[0], 
      user: `${currentUser.name} (Admin Override)` 
    }]);
    setRemarks(prev => [...prev, { 
      remark: `Admin stage change: ${reason}`, 
      date: new Date().toISOString().split('T')[0], 
      user: currentUser.name 
    }]);
  };
  
  const handleTaskComplete = (taskData: TaskData, resultingStage: string | null) => {
    const taskWithMetadata: TaskData = { 
      ...taskData, 
      date: new Date().toISOString().split('T')[0], 
      user: 'Sarah Miller' 
    };
    
    setTasks(prev => [...prev, taskWithMetadata]);

    if (taskData.remarks) {
      setRemarks(prev => [...prev, { 
        remark: taskData.remarks, 
        date: new Date().toISOString().split('T')[0], 
        user: 'Sarah Miller' 
      }]);
    }

    if (taskData.taskType === 'Tracking' && taskData.trackingStatus === 'Credentials logging') {
      setUniversityApps(prev => [...prev, {
        name: taskData.universityName || '',
        url: taskData.universityUrl || '',
        username: taskData.username || '',
        password: taskData.password || '',
      }]);
    }

    if (resultingStage && resultingStage !== currentStage) {
      const newStageIndex = PIPELINE_STAGES.indexOf(resultingStage);
      if (newStageIndex !== -1) {
        setLead(prev => ({ ...prev, currentStageIndex: newStageIndex }));
        setHistory(prev => [...prev, { 
          stage: resultingStage, 
          date: new Date().toISOString().split('T')[0], 
          user: 'Sarah Miller (Task)' 
        }]);
        alert(`Task saved! Lead moved from "${currentStage}" to "${resultingStage}".`);
      }
    } else {
      alert(`Task saved! No stage change triggered from "${currentStage}".`);
    }
  };

  const lastTask = tasks.length > 0 ? tasks[tasks.length - 1] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{lead.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{lead.email}</span>
                  <span>•</span>
                  <span>{lead.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button 
                  variant="outline"
                  onClick={() => setIsAdminStageModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin: Change Stage
                </Button>
              )}
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
              <Button 
                onClick={handleOpenStageModal} 
                disabled={isFinalStage}
                className="flex items-center gap-2"
              >
                <span>Manual Advance</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Lead Owner</p>
              <p className="text-xl font-bold mt-2">{lead.counselor}</p>
              <p className="text-sm text-muted-foreground">{lead.counselorPhone}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Manager</p>
              <p className="text-xl font-bold mt-2">{lead.manager}</p>
              <p className="text-sm text-muted-foreground">{lead.managerPhone}</p>
            </CardContent>
          </Card>
        </div>

        {/* Stage Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">
              Current Stage: <Badge variant="outline">{currentStage}</Badge>
            </p>
            <p className="text-sm text-muted-foreground">
              {lead.currentStageIndex + 1} of {PIPELINE_STAGES.length}
            </p>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <TaskComposer onTaskComplete={handleTaskComplete} currentStage={currentStage} />
              </CardContent>
            </Card>
            
            <LeadDataCard lead={lead} lastTask={lastTask} />
            
            <Card>
              <CardHeader>
                <CardTitle>University Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {universityApps.length > 0 ? (
                  <div className="space-y-4">
                    {universityApps.map((app, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <p className="font-semibold">{app.name}</p>
                        <p className="text-sm text-blue-500">
                          <a href={app.url} target="_blank" rel="noopener noreferrer">{app.url}</a>
                        </p>
                        <div className="text-sm mt-2 space-y-1">
                          <p><span className="font-medium">Username:</span> {app.username}</p>
                          <div className="flex items-center gap-2">
                            <p><span className="font-medium">Password:</span> {visiblePasswords[index] ? app.password : '••••••••'}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => togglePasswordVisibility(index)}
                            >
                              {visiblePasswords[index] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No university applications logged yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full">
              <Tabs defaultValue="stage-log" className="w-full">
                <div className="border-b px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="stage-log">Stage Log</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="remarks">Remarks</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="stage-log" className="px-6 py-4">
                  <div className="space-y-4">
                    {history.slice().reverse().map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-primary-foreground" />
                          </div>
                          {index < history.length - 1 && <div className="w-0.5 h-12 bg-border"></div>}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.stage}</p>
                          <p className="text-xs text-muted-foreground">by {item.user} on {item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="px-6 py-4">
                  <div className="space-y-4">
                    {tasks.slice().reverse().map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <ClipboardList className="w-3 h-3 text-white" />
                          </div>
                          {index < tasks.length - 1 && <div className="w-0.5 h-12 bg-border"></div>}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.taskType}</p>
                          <p className="text-xs text-muted-foreground">
                            Status: {item.callType || item.connectStatus || item.finalStatus || 'Completed'}
                          </p>
                          <p className="text-xs text-muted-foreground">by {item.user} on {item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="remarks" className="px-6 py-4">
                  <div className="space-y-4">
                    {remarks.slice().reverse().map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-3 h-3 text-white" />
                          </div>
                          {index < remarks.length - 1 && <div className="w-0.5 h-12 bg-border"></div>}
                        </div>
                        <div>
                          <div className="text-sm bg-muted p-3 rounded-lg">
                            {item.remark}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">by {item.user} on {item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>

      {/* Manual Stage Move Modal */}
      {isStageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background w-full max-w-md p-6 rounded-lg shadow-xl m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Confirm Manual Stage Change</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseStageModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to manually move this lead from <strong>{currentStage}</strong> to <strong>{nextManualStage}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseStageModal}>Cancel</Button>
              <Button onClick={handleConfirmStageMove}>Confirm & Move</Button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Stage Manager Modal */}
      <AdminStageManager
        lead={lead}
        onStageChange={handleAdminStageChange}
        isOpen={isAdminStageModalOpen}
        onClose={() => setIsAdminStageModalOpen(false)}
      />
    </div>
  );
};

export default LeadWorkspace;
