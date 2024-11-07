"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Html5QrcodePlugin from "@/components/Html5QrcodeScanner";
import { toast } from "sonner";
import { getTicketsScan } from "@/actions/tickets";
import { Loader } from "lucide-react";

export default function QRCodeScanner() {
  const [scannedDecodedText, setScannedDecodedText] = useState<string | null>(
    null
  );
  const [pending, setPending] = useState(false);

  async function checkIn() {
    if (pending) return;
    try {
      setPending(true);
      const res = await getTicketsScan(scannedDecodedText ?? "");

      if (res?.data) {
        toast.error("Check in successful");
      } else {
        toast.error(res?.message ?? "something went wrong!");
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("something went wrong!");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center'>
      <Card className='md:min-w-[465px] lg:min-w-[565px]'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='aspect-square overflow-hidden rounded-lg'>
            <Html5QrcodePlugin
              fps={10}
              qrbox={200}
              disableFlip={false}
              qrCodeSuccessCallback={(decodedText) => {
                setScannedDecodedText(decodedText);
              }}
            />
          </div>

          <div className='flex flex-col items-center text-center gap-2 w-full'>
            <p>
              Scanned Ticket ID:{" "}
              {scannedDecodedText ? scannedDecodedText : "N/A"}
            </p>
            <div className='grid grid-cols-2 gap-4 w-full'>
              <Button
                disabled={!scannedDecodedText || pending}
                className='disabled:opacity-50'
                onClick={checkIn}
              >
                {pending && <Loader className='animate-spin' />}
                <span>Check in</span>
              </Button>
              <Button variant='destructive' className=''>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className='text-center text-sm text-gray-500 w-full'>
          <p className='w-full'>
            Position the QR code within the frame to scan
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
