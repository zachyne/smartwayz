import React from "react";
import ReportForm from "./ReportForm/ReportForm";
import PageHeader from "../components/PageHeader";

const NewReport = () => {
  return (
    <div className="flex-1 flex flex-col text-white font-[Kanit] min-h-full" style={{
        background: 'linear-gradient(to bottom, #37366B 0%, #0A0E27 100%)'
      }}>      
      <PageHeader
        title="New Report"
        description="Help us maintain and improve our city's infrastructure by reporting issues you encounter."
      />
      <div className="flex-1 flex items-center justify-center p-8">
        <ReportForm />
      </div>
    </div>
  );
};

export default NewReport;