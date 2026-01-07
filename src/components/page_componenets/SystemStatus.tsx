
import { useEffect, useState, useMemo, useRef, memo, useCallback } from "react";

export const SystemStatusDashboard = memo(function SystemStatusDashboard({ lightMode }: any) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [uptime, setUptime] = useState(0);
    const [githubData, setGithubData] = useState<any>(null);
    const [startTime] = useState(Date.now());
  
    // Update time every second
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
        setUptime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }, [startTime]);
  
    // Fetch GitHub data
    useEffect(() => {
      const fetchGitHubData = async () => {
        try {
          // Using GitHub's public API (no auth required for basic info)
          const response = await fetch('https://api.github.com/users/anigmea');
          if (response.ok) {
            const data = await response.json();
            setGithubData({
              publicRepos: data.public_repos,
              followers: data.followers,
              following: data.following,
              lastUpdate: new Date(data.updated_at).toLocaleDateString()
            });
          }
        } catch {
          console.log('GitHub API not available');
        }
      };
      fetchGitHubData();
    }, []);
  
    const formatUptime = (seconds: any) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
  
    return (
      <div className="w-full max-w-4xl">
        <h2 className={`text-3xl font-bold mb-6 ${lightMode ? 'text-blue-600' : 'text-cyan-200'}`}>
          System Status Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Local Time */}
          <div className={`border rounded-lg p-4 ${lightMode ? 'border-blue-300 bg-blue-50' : 'border-cyan-500/50 bg-black/20'}`}>
            <h3 className={`text-lg font-bold mb-2 ${lightMode ? 'text-blue-700' : 'text-cyan-300'}`}>
              Local Time
            </h3>
            <div className={`text-2xl font-mono ${lightMode ? 'text-blue-600' : 'text-cyan-400'}`}>
              {currentTime.toLocaleTimeString()}
            </div>
            <div className={`text-sm ${lightMode ? 'text-blue-500' : 'text-cyan-500'}`}>
              {currentTime.toLocaleDateString()}
            </div>
          </div>
  
          {/* System Uptime */}
          <div className={`border rounded-lg p-4 ${lightMode ? 'border-green-300 bg-green-50' : 'border-green-500/50 bg-black/20'}`}>
            <h3 className={`text-lg font-bold mb-2 ${lightMode ? 'text-green-700' : 'text-green-300'}`}>
              System Uptime
            </h3>
            <div className={`text-2xl font-mono ${lightMode ? 'text-green-600' : 'text-green-400'}`}>
              {formatUptime(uptime)}
            </div>
            <div className={`text-sm ${lightMode ? 'text-green-500' : 'text-green-500'}`}>
              Since page load
            </div>
          </div>
  
          {/* Creator Status */}
          <div className={`border rounded-lg p-4 ${lightMode ? 'border-purple-300 bg-purple-50' : 'border-purple-500/50 bg-black/20'}`}>
            <h3 className={`text-lg font-bold mb-2 ${lightMode ? 'text-purple-700' : 'text-purple-300'}`}>
              Creator Status
            </h3>
            {githubData ? (
              <div className="space-y-1">
                <div className={`text-lg font-mono ${lightMode ? 'text-purple-600' : 'text-purple-400'}`}>
                  {githubData.publicRepos} repos
                </div>
                <div className={`text-sm ${lightMode ? 'text-purple-500' : 'text-purple-500'}`}>
                  {githubData.followers} followers
                </div>
                <div className={`text-xs ${lightMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Updated: {githubData.lastUpdate}
                </div>
              </div>
            ) : (
              <div className={`text-sm ${lightMode ? 'text-purple-500' : 'text-purple-500'}`}>
                Loading GitHub data...
              </div>
            )}
          </div>
        </div>
  
        {/* System Health Indicators */}
        <div className="mt-6">
          <h3 className={`text-xl font-bold mb-4 ${lightMode ? 'text-gray-700' : 'text-gray-300'}`}>
            System Health
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`border rounded-lg p-3 ${lightMode ? 'border-green-300 bg-green-50' : 'border-green-500/50 bg-black/20'}`}>
              <div className={`text-sm font-bold ${lightMode ? 'text-green-700' : 'text-green-300'}`}>CPU</div>
              <div className={`text-lg font-mono ${lightMode ? 'text-green-600' : 'text-green-400'}`}>Optimal</div>
            </div>
            <div className={`border rounded-lg p-3 ${lightMode ? 'border-blue-300 bg-blue-50' : 'border-blue-500/50 bg-black/20'}`}>
              <div className={`text-sm font-bold ${lightMode ? 'text-blue-700' : 'text-blue-300'}`}>Memory</div>
              <div className={`text-lg font-mono ${lightMode ? 'text-blue-600' : 'text-blue-400'}`}>Stable</div>
            </div>
            <div className={`border rounded-lg p-3 ${lightMode ? 'border-yellow-300 bg-yellow-50' : 'border-yellow-500/50 bg-black/20'}`}>
              <div className={`text-sm font-bold ${lightMode ? 'text-yellow-700' : 'text-yellow-300'}`}>Network</div>
              <div className={`text-lg font-mono ${lightMode ? 'text-yellow-600' : 'text-yellow-400'}`}>Connected</div>
            </div>
            <div className={`border rounded-lg p-3 ${lightMode ? 'border-purple-300 bg-purple-50' : 'border-purple-500/50 bg-black/20'}`}>
              <div className={`text-sm font-bold ${lightMode ? 'text-purple-700' : 'text-purple-300'}`}>AI Core</div>
              <div className={`text-lg font-mono ${lightMode ? 'text-purple-600' : 'text-purple-400'}`}>Active</div>
            </div>
          </div>
        </div>
      </div>
    );
  });
  