import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ActorViewPage() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const actorName = searchParams.get('actor');
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (!projectId || !actorName) {
      setInfo('Missing project or actor information in URL');
    } else {
      setInfo(`Loading show for ${actorName} in project ${projectId}...`);
    }
  }, [projectId, actorName]);

  if (!projectId || !actorName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Stage Blocks - Actor View</h1>
          <p className="text-gray-600 mb-4">
            Please use the link provided by your director.
          </p>
          <p className="text-gray-500 text-sm">
            URL should include ?project=NAME&actor=NAME
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f1ed' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold" style={{ color: '#5A2020' }}>
            Stage Blocks
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {actorName} • Rehearsal Cues
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 text-lg">{info}</p>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              Coming in Session 2: Actor cue display, scene selection, notes, etc.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
