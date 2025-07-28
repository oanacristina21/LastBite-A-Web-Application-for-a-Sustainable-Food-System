import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  cod: string;
};

export const CodRidicareQRCode = ({ cod }: Props) => {
  const url = `http://localhost:3000/ridicare/${cod}`;
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md">
      <QRCodeCanvas value={url} size={160} />
      <p className="mt-4 font-semibold text-center text-gray-800">{cod}</p>
    </div>
  );
};
