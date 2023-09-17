const current = 'aria-[pressed]:brightness-75 aria-[current]:brightness-150';
export const className = {
  input: 'rounded pl-1 pr-1 sm:pl-3 sm:pr-3 border-none ring-1 ring-black',
  button: `inline-flex justify-center items-center px-4 py-2 rounded-md border-none text-white ${current}`,
  success: 'bg-green-600 hover:bg-green-700',
  danger: 'bg-red-600 hover:bg-red-700',
  info: 'bg-blue-600 hover:bg-blue-700',
  link: `inline-flex justify-center items-center text-blue-400 transition
  hover:text-black ${current}`,
};
