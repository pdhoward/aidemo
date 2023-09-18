
  
  
export const detectLanguage = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch(extension) {
      case 'js': return 'javascript';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'c': return 'c';
      case 'cbl': return 'cobol'    
      case 'sql': return 'sql'
  
      // ... Add more cases as needed ...
      case 'pl1': return 'text'
      case 'bms': return 'text'
      case 'jcl': return 'text'
      case 'prc': return 'text'
      default: return 'text'; // default to text if unknown
    }
  }