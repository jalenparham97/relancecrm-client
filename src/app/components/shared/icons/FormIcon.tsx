interface Props {
  style?: React.CSSProperties;
  size?: string | number;
  className?: string;
}

export default function FormIcon({ style, size = '16px', className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Outline"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      style={style}
      className={`${className} fill-current`}
    >
      <path d="M 12.5 4 C 10.02 4 8 6.02 8 8.5 L 8 39.5 C 8 41.98 10.02 44 12.5 44 L 35.5 44 C 37.981 44 40 41.981 40 39.5 L 40 18.5 C 40 18.085 39.831797 17.710703 39.560547 17.439453 L 26.560547 4.4394531 C 26.289297 4.1682031 25.915 4 25.5 4 L 12.5 4 z M 12.5 7 L 24 7 L 24 15.5 C 24 17.98 26.02 20 28.5 20 L 37 20 L 37 39.5 C 37 40.327 36.327 41 35.5 41 L 12.5 41 C 11.67 41 11 40.33 11 39.5 L 11 8.5 C 11 7.67 11.67 7 12.5 7 z M 27 9.1210938 L 34.878906 17 L 28.5 17 C 27.67 17 27 16.33 27 15.5 L 27 9.1210938 z M 16.5 24 A 2.5 2.5 0 0 0 16.5 29 A 2.5 2.5 0 0 0 16.5 24 z M 23.5 25 A 1.50015 1.50015 0 1 0 23.5 28 L 32.5 28 A 1.50015 1.50015 0 1 0 32.5 25 L 23.5 25 z M 16.5 32 A 2.5 2.5 0 0 0 16.5 37 A 2.5 2.5 0 0 0 16.5 32 z M 23.5 33 A 1.50015 1.50015 0 1 0 23.5 36 L 32.5 36 A 1.50015 1.50015 0 1 0 32.5 33 L 23.5 33 z" />
    </svg>
  );
}
