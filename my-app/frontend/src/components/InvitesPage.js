import React, { useEffect, useState } from 'react';
import './InvitesPage.css';

const InvitesPage = ({ user }) => {
  const [sentInvites, setSentInvites] = useState([]);
  const [receivedInvites, setReceivedInvites] = useState([]);

  useEffect(() => {
    const fetchSentInvites = async () => {
      const response = await fetch(`http://localhost:5000/api/invites/sent/${user.email}`);
      const data = await response.json();
      setSentInvites(data);
    };

    const fetchReceivedInvites = async () => {
      const response = await fetch(`http://localhost:5000/api/invites/received/${user.email}`);
      const data = await response.json();
      setReceivedInvites(data);
    };

    fetchSentInvites();
    fetchReceivedInvites();
  }, [user.email]);

  const handleUpdateStatus = async (id, status) => {
    const response = await fetch('http://localhost:5000/api/invites/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status }),
    });

    if (response.ok) {
      setReceivedInvites((prevInvites) =>
        prevInvites.map((invite) =>
          invite.id === id ? { ...invite, reply: status } : invite
        )
      );
    }
  };

  return (
    <div className="invites-page">
      <h1>Sent Invites</h1>
      <ul className="invites-list">
        {sentInvites.map((invite) => (
          <li key={invite.id} className="invite-item">
            <p>Receiver Email: {invite.receiver_email}</p>
            <p>Status: {invite.reply}</p>
          </li>
        ))}
      </ul>

      <h1>Received Invites</h1>
      <ul className="invites-list">
        {receivedInvites.map((invite) => (
          <li key={invite.id} className="invite-item">
            <p>Sender Email: {invite.sender_email}</p>
            <p>Status: {invite.reply}</p>
            <button onClick={() => handleUpdateStatus(invite.id, 'accepted')}>Accept</button>
            <button onClick={() => handleUpdateStatus(invite.id, 'declined')}>Decline</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvitesPage;