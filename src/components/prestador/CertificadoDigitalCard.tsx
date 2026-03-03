import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Upload, X, Eye, EyeOff, FileKey2 } from 'lucide-react';
import { toast } from 'sonner';

const CertificadoDigitalCard: React.FC = () => {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.pfx', '.p12'].includes(ext)) {
      toast.error('Formato inválido. Use arquivos .pfx ou .p12');
      return;
    }
    setArquivo(file);
    setNomeArquivo(file.name);
    toast.success(`Certificado "${file.name}" selecionado`);
  };

  const handleRemover = () => {
    setArquivo(null);
    setNomeArquivo('');
    setSenha('');
    if (inputRef.current) inputRef.current.value = '';
    toast.info('Certificado removido');
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Certificado Digital (e-CNPJ)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept=".pfx,.p12"
          className="hidden"
          onChange={handleFileSelect}
        />

        {!nomeArquivo ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-accent/30 transition-colors cursor-pointer"
          >
            <Upload className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              Clique para importar o certificado
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              Formatos aceitos: .pfx, .p12
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-accent/40 rounded-md px-3 py-2">
            <FileKey2 className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-medium text-foreground truncate flex-1">
              {nomeArquivo}
            </span>
            <button
              type="button"
              onClick={handleRemover}
              className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div>
          <label className="field-label text-xs">Senha do Certificado</label>
          <div className="relative">
            <input
              type={showSenha ? 'text' : 'password'}
              className="field-input pr-9 text-sm"
              placeholder="Digite a senha do certificado"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificadoDigitalCard;
