import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const TestAdmin = () => {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    console.log('=== TEST FETCH START ===');
    
    try {
      const { data, error } = await supabase
        .from('access_attempts')
        .select('*')
        .order('timestamp', { ascending: false });
      
      console.log('TEST FETCH RESULT:', { data, error });
      
      if (data) {
        setAttempts(data);
        console.log('TEST: Found', data.length, 'attempts');
      }
    } catch (err) {
      console.error('TEST FETCH ERROR:', err);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    testFetch();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Test Page</h1>
      
      <Button onClick={testFetch} disabled={loading} className="mb-4">
        {loading ? 'Loading...' : 'Refresh Data'}
      </Button>
      
      <div className="space-y-4">
        <p>Found {attempts.length} access attempts:</p>
        
        {attempts.map((attempt, index) => (
          <div key={attempt.id || index} className="p-4 border rounded">
            <p><strong>Email:</strong> {attempt.email}</p>
            <p><strong>Password:</strong> {attempt.passphrase}</p>
            <p><strong>Item:</strong> {attempt.item_name}</p>
            <p><strong>Status:</strong> {attempt.status}</p>
            <p><strong>Time:</strong> {attempt.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestAdmin;