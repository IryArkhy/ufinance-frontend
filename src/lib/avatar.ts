export function stringToColor(string: string) {
  //   const colors = [
  //     '#f47b7b',
  //     '#f4ab7b',
  //     '#649d1a',
  //     '#066f0c',
  //     '#066f6f',
  //     '#064f6f',
  //     '#06376f',
  //     '#48066f',
  //   ];

  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: name.slice(0, 2),
  };
}
