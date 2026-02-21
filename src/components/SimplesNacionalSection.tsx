import React from 'react';
import { FileText } from 'lucide-react';

const SimplesNacionalSection: React.FC = () => {
  return (
    <div className="section-card">
      <h2 className="section-title">
        <FileText className="w-5 h-5 text-primary" />
        Simples Nacional
      </h2>
    </div>
  );
};

export default SimplesNacionalSection;
