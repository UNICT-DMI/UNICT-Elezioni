function fixName(str: string): string {
  return str.replaceAll('_', ' ').replaceAll('-', ' ');
}

export default fixName;
