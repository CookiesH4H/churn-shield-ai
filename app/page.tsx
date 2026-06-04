import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ChurnRiskOverview from "@/components/Dashboard/ChurnRiskOverview";
import CustomerList from "@/components/Dashboard/CustomerList";
import AIAgentPanel from "@/components/Dashboard/AIAgentPanel";
import ChurnTrends from "@/components/Dashboard/ChurnTrends";
import CustomerProfile from "@/components/Dashboard/CustomerProfile";
import { DashboardProvider } from "@/context/DashboardContext";

export default function Home() {
  return (
    <DashboardProvider>
      <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <TopBar />

        {/* Scrollable Dashboard Container */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* Page Title */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-text-bright tracking-tight">Churn Shield AI</h1>
              <div className="hidden lg:flex items-center gap-4 text-sm text-text-muted">
                <span>Plataforma de Predicción</span>
                <span className="text-text-bright font-medium bg-hover px-3 py-1 rounded-md border border-card-border">Arca Continental</span>
              </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
              
              {/* Left/Center Column Group (8 cols wide) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Row 1: Risk Overview (3 cols) & Customer List (5 cols) */}
                <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
                  <div className="md:col-span-3 min-h-[340px]">
                    <ChurnRiskOverview />
                  </div>
                  <div className="md:col-span-5 min-h-[340px]">
                    <CustomerList />
                  </div>
                </div>

                {/* Row 2: Churn Trends (5 cols) & Customer Profile (3 cols) */}
                <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
                  <div className="md:col-span-5 min-h-[400px]">
                    <ChurnTrends />
                  </div>
                  <div className="md:col-span-3 min-h-[400px]">
                    <CustomerProfile />
                  </div>
                </div>
                
              </div>

              {/* Right Column: AI Panel (4 cols wide, spans full height) */}
              <div className="lg:col-span-4 min-h-[764px]">
                <AIAgentPanel />
              </div>

            </div>
          </div>
        </main>
      </div>
      </div>
    </DashboardProvider>
  );
}
