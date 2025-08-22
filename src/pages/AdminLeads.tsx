
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Search, Users, Filter, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 18 stages for the CRM pipeline
const LEAD_STAGES = [
  'Yet to Assign',
  'Assigned',
  'Initial Contact',
  'Interest Confirmed',
  'Documents Requested',
  'Documents Received',
  'Profile Evaluation',
  'University Shortlisting',
  'Application Preparation',
  'Application Submitted',
  'Offer Received',
  'Offer Accepted',
  'Visa Documentation',
  'Visa Applied',
  'Visa Approved',
  'Pre-departure',
  'Departed',
  'Enrolled'
];

// Mock counselors for assignment
const COUNSELORS = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@buildabroad.com' },
  { id: 2, name: 'Michael Chen', email: 'michael@buildabroad.com' },
  { id: 3, name: 'Emma Rodriguez', email: 'emma@buildabroad.com' },
  { id: 4, name: 'David Kumar', email: 'david@buildabroad.com' },
];

// Mock leads data
const MOCK_LEADS = [
  { id: 1, name: 'John Smith', email: 'john@email.com', phone: '+1234567890', stage: 'Yet to Assign', country: 'USA', course: 'Computer Science', counselor: null, createdAt: '2024-01-15' },
  { id: 2, name: 'Emily Johnson', email: 'emily@email.com', phone: '+1234567891', stage: 'Yet to Assign', country: 'Canada', course: 'Business Administration', counselor: null, createdAt: '2024-01-14' },
  { id: 3, name: 'Michael Brown', email: 'michael@email.com', phone: '+1234567892', stage: 'Assigned', country: 'UK', course: 'Data Science', counselor: 'Sarah Johnson', createdAt: '2024-01-13' },
  { id: 4, name: 'Sarah Davis', email: 'sarah@email.com', phone: '+1234567893', stage: 'Initial Contact', country: 'Australia', course: 'Engineering', counselor: 'Michael Chen', createdAt: '2024-01-12' },
  { id: 5, name: 'Alex Wilson', email: 'alex@email.com', phone: '+1234567894', stage: 'Yet to Assign', country: 'USA', course: 'Medicine', counselor: null, createdAt: '2024-01-11' },
];

const AdminLeads = () => {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState('Yet to Assign');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [showBulkAssign, setShowBulkAssign] = useState(false);

  // Filter leads based on stage and search term
  const filteredLeads = MOCK_LEADS.filter(lead => {
    const matchesStage = lead.stage === selectedStage;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    return matchesStage && matchesSearch;
  });

  const handleSelectLead = (leadId: number) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleBulkAssign = () => {
    if (selectedLeads.length > 0 && selectedCounselor) {
      console.log(`Assigning ${selectedLeads.length} leads to ${selectedCounselor}`);
      // Here you would integrate with your backend
      setSelectedLeads([]);
      setSelectedCounselor('');
      setShowBulkAssign(false);
    }
  };

  const getStageColor = (stage: string) => {
    const stageIndex = LEAD_STAGES.indexOf(stage);
    if (stageIndex <= 1) return 'bg-red-100 text-red-800';
    if (stageIndex <= 5) return 'bg-yellow-100 text-yellow-800';
    if (stageIndex <= 10) return 'bg-blue-100 text-blue-800';
    if (stageIndex <= 14) return 'bg-purple-100 text-purple-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="bg-primary text-primary-foreground p-2 rounded-lg mr-3">
                <Users className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Lead Management</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Stage Filter */}
            <div className="flex-1">
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STAGES.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Bulk Actions */}
            {selectedLeads.length > 0 && (
              <Button 
                onClick={() => setShowBulkAssign(true)}
                className="whitespace-nowrap"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Selected ({selectedLeads.length})
              </Button>
            )}
          </div>

          {/* Bulk Assignment Modal */}
          {showBulkAssign && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-lg">Bulk Assignment</CardTitle>
                <CardDescription>
                  Assign {selectedLeads.length} selected leads to a counselor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Select value={selectedCounselor} onValueChange={setSelectedCounselor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select counselor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNSELORS.map((counselor) => (
                          <SelectItem key={counselor.id} value={counselor.name}>
                            {counselor.name} - {counselor.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleBulkAssign} disabled={!selectedCounselor}>
                    Assign Leads
                  </Button>
                  <Button variant="outline" onClick={() => setShowBulkAssign(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredLeads.length} leads in <Badge variant="outline" className={getStageColor(selectedStage)}>{selectedStage}</Badge> stage
          </p>
        </div>

        {/* Leads Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Counselor</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => handleSelectLead(lead.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.country}</TableCell>
                  <TableCell>{lead.course}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStageColor(lead.stage)}>
                      {lead.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.counselor || 'Unassigned'}</TableCell>
                  <TableCell>{lead.createdAt}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No leads match your search criteria.' : `No leads in ${selectedStage} stage.`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLeads;
