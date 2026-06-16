const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
require('@testing-library/jest-dom');

// A Mock Blog Component that handles UI elements, Admin privileges, and Form validation
function BlogSystem({ userRole }) {
  const [comment, setComment] = React.useState('');
  const [error, setError] = React.useState('');

  const handlePostComment = () => {
    if (!comment.trim()) {
      setError('Validation Error: Comment cannot be empty');
    } else {
      setError('');
    }
  };

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Welcome to WanderLust'),
    React.createElement('p', null, `Logged in as: ${userRole}`),
    
    // Admin access control point
    userRole === 'Admin' 
      ? React.createElement('button', null, 'Delete Post (Admin Only)')
      : null,

    // Comment submission interfaces
    React.createElement('input', {
      'data-testid': 'comment-input',
      value: comment,
      onChange: (e) => setComment(e.target.value),
      placeholder: 'Write a comment...'
    }),
    React.createElement('button', { onClick: handlePostComment }, 'Post Comment'),
    error ? React.createElement('span', { role: 'alert' }, error) : null
  );
}

describe('WanderLust Blog System Suite (5-Point Evaluation)', () => {

  // TEST 1: UI RENDERING
  it('TEST 1: Verifies that core UI typography elements render properly without crashing', () => {
    render(React.createElement(BlogSystem, { userRole: 'Guest' }));
    
    const heading = screen.getByText('Welcome to WanderLust');
    expect(heading).toBeInTheDocument();
  });

  // TEST 2: UI RENDERING
  it('TEST 2: Verifies that the UI dynamically displays the correct user status badge on login', () => {
    render(React.createElement(BlogSystem, { userRole: 'Guest' }));
    
    const userBadge = screen.getByText('Logged in as: Guest');
    expect(userBadge).toBeInTheDocument();
  });

  // TEST 3: SECURITY
  it('TEST 3: Enforces Security/RBAC — Confirms administrative users are authorized to see dangerous actions', () => {
    render(React.createElement(BlogSystem, { userRole: 'Admin' }));
    
    const deleteButton = screen.getByText('Delete Post (Admin Only)');
    expect(deleteButton).toBeInTheDocument();
  });

  // TEST 4: SECURITY
  it('TEST 4: Enforces Security/RBAC — Restricts unauthenticated guest accounts from interacting with admin panels', () => {
    render(React.createElement(BlogSystem, { userRole: 'Guest' }));
    
    const deleteButton = screen.queryByText('Delete Post (Admin Only)');
    expect(deleteButton).not.toBeInTheDocument();
  });

  // TEST 5: INPUT VALIDATION
  it('TEST 5: Validates form input safely and rejects submissions containing empty strings', () => {
    render(React.createElement(BlogSystem, { userRole: 'Guest' }));
    
    const postButton = screen.getByText('Post Comment');
    fireEvent.click(postButton);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Validation Error: Comment cannot be empty');
  });

});