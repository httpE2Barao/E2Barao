export function parsePostgresArray(arr: any): string[] {
  if (Array.isArray(arr)) return arr;
  if (typeof arr === 'string') {
    if (arr.startsWith('{') && arr.endsWith('}')) {
      const inner = arr.slice(1, -1);
      if (!inner) return [];
      return inner.split(',').map(s => s.trim()).filter(Boolean);
    }
    try { return JSON.parse(arr); } catch { return []; }
  }
  return [];
}

export function parsePostgresIntArray(arr: any): number[] {
  if (Array.isArray(arr)) return arr.map(Number).filter(n => !isNaN(n));
  if (typeof arr === 'string') {
    if (arr.startsWith('{') && arr.endsWith('}')) {
      const inner = arr.slice(1, -1);
      if (!inner) return [];
      return inner.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    }
    try { return JSON.parse(arr); } catch { return []; }
  }
  return [];
}

export function formatPgArray(arr: (string | number)[]): string {
  if (!arr || arr.length === 0) return '{}';
  return `{${arr.join(',')}}`;
}
