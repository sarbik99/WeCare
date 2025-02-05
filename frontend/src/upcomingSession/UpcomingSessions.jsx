import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

const sessions = [
  {
    id: 4,
    name: "How to be Productive",
    professor: "Dr . Sarbik Chatterjee",
    date: "Feb 10, 2025",
    time: "10:00 AM - 12:00 PM",
    image: "https://via.placeholder.com/50"
  },
  {
    id: 1,
    name: "How to be Productive",
    professor: "Dr . Sarbik Chatterjee",
    date: "Feb 10, 2025",
    time: "10:00 AM - 12:00 PM",
    image: "https://via.placeholder.com/50"
  },
  {
    id: 2,
    name: "Enjoy your Nature",
    professor: "Suvayu Nandy",
    date: "Feb 10, 2025",
    time: "10:00 AM - 12:00 PM",
    image: "https://via.placeholder.com/50"
  },
  {
    id: 3,
    name: "Move Forward",
    professor: "Dr. Ankit Ghosh",
    date: "Feb 15, 2025",
    time: "2:00 PM - 4:00 PM",
    image: "https://via.placeholder.com/50"
  }
];

export default function UpcomingSessions() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [userInfo, setUserInfo] = useState({ name: "", email: "", sessionId: null });

  const handleJoinClick = (session) => {
    setSelectedSession(session);
    setUserInfo({ ...userInfo, sessionId: session.id });
    setIsDialogOpen(true);
  };
  
    const handleSubmit = () => {
      console.log("User Info Submitted:", userInfo);
      setIsDialogOpen(false);
    };
  
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 bg-lime-400 px-4 py-2 rounded-full inline-block">Upcoming Sessions</h2>
        <div className="overflow-x-auto whitespace-nowrap py-4">
          <div className="flex space-x-4">
            {sessions.map((session) => (
              <Card key={session.id} className="p-4 flex flex-col items-center min-w-[250px]">
                <img src={session.image} alt={session.name} className="w-12 h-12 rounded-full mb-2" />
                <CardContent className="text-center">
                  <h3 className="text-lg font-semibold">{session.name}</h3>
                  <p className="text-sm text-gray-600">{session.professor}</p>
                  <p className="text-sm text-gray-600">{session.date} | {session.time}</p>
                </CardContent>
                  <Button onClick={() => handleJoinClick(session)} className="mt-2">Join</Button>
                
              </Card>
            ))}
          </div>
        </div>
  
        {isDialogOpen && selectedSession && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join "{selectedSession.name}"</DialogTitle>
              </DialogHeader>
              <Input
                type="text"
                placeholder="Your Name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                className="mb-2"
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              />
              <DialogFooter>
                <Button onClick={handleSubmit} className="mt-2">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }
  