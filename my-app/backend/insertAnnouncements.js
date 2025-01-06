const { Pool } = require('pg');
const pool = new Pool({
  user: 'talos',
  host: 'localhost',
  database: 'talos',
  password: 'talos',
  port: 5432,
});

const announcements = [
  {
    title: 'Ανακοίνωση 1',
    description: 'Περιγραφή της ανακοίνωσης 1',
    presentation_date: '2025-11-01',
  },
  {
    title: 'Ανακοίνωση 2',
    description: 'Περιγραφή της ανακοίνωσης 2',
    presentation_date: '2025-11-02',
  },
  {
    title: 'Ανακοίνωση 3',
    description: 'Περιγραφή της ανακοίνωσης 3',
    presentation_date: '2025-11-03',
  },
  {
    title: 'Ανακοίνωση 4',
    description: 'Περιγραφή της ανακοίνωσης 4',
    presentation_date: '2025-11-04',
  },
  {
    title: 'Ανακοίνωση 5',
    description: 'Περιγραφή της ανακοίνωσης 5',
    presentation_date: '2025-11-05',
  },
  {
    title: 'Ανακοίνωση 6',
    description: 'Περιγραφή της ανακοίνωσης 6',
    presentation_date: '2025-11-06',
  },
  {
    title: 'Ανακοίνωση 7',
    description: 'Περιγραφή της ανακοίνωσης 7',
    presentation_date: '2025-11-07',
  },
  {
    title: 'Ανακοίνωση 8',
    description: 'Περιγραφή της ανακοίνωσης 8',
    presentation_date: '2025-11-08',
  },
  {
    title: 'Ανακοίνωση 9',
    description: 'Περιγραφή της ανακοίνωσης 9',
    presentation_date: '2025-11-09',
  },
  {
    title: 'Ανακοίνωση 10',
    description: 'Περιγραφή της ανακοίνωσης 10',
    presentation_date: '2025-11-10',
  },
];

const insertAnnouncements = async () => {
  try {
    await pool.connect();
    for (const announcement of announcements) {
      await pool.query(
        'INSERT INTO announcements (title, description, presentation_date) VALUES ($1, $2, $3)',
        [announcement.title, announcement.description, announcement.presentation_date]
      );
    }
    console.log('Announcements inserted successfully');
  } catch (error) {
    console.error('Error inserting announcements:', error);
  } finally {
    await pool.end();
  }
};

insertAnnouncements();