export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  organizerId: string;
  registrationCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  organizerName?: string;
  details?: {
    eligibility?: string;
    prizes?: string;
    timeline?: {
      registrationOpens: string;
      registrationCloses: string;
      eventBegins: string;
      eventEnds: string;
      winnersAnnouncement: string;
    };
  };
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDept: string;
  studentYear: string;
  studentRoll: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'organizer';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event_created' | 'student_applied';
  timestamp: string;
  read: boolean;
}
