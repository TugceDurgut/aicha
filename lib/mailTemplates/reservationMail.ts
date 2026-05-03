interface ReservationMailProps {
  name: string;
  email: string;
  startDate: string;
  endDate: string;
  phone?: string;
  guestCount?: number;
  note?: string;
  listingTitle?: string;
}

export function reservationMailTemplate({
  name,
  email,
  startDate,
  endDate,
  phone,
  guestCount,
  note,
  listingTitle,
}: ReservationMailProps): string {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0"
            style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;">
            
            <tr>
              <td style="background:#111827;color:#fff;padding:20px 24px;">
                <h2 style="margin:0;">📩 Yeni Rezervasyon Talebi</h2>
              </td>
            </tr>

            <tr>
              <td style="padding:24px;">
                ${listingTitle ? `<p><b>Villa:</b> ${listingTitle}</p>` : ""}
                <p><b>İsim:</b> ${name}</p>
                <p><b>Email:</b> <a href="mailto:${email}">${email}</a></p>
                ${
                  phone
                    ? `<p><b>Telefon:</b> <a href="tel:${phone}">${phone}</a></p>`
                    : ""
                }
                ${guestCount ? `<p><b>Kişi Sayısı:</b> ${guestCount}</p>` : ""}
                <p><b>Giriş:</b> ${startDate}</p>
                <p><b>Çıkış:</b> ${endDate}</p>
                ${note ? `<p><b>Not:</b><br/>${note}</p>` : ""}

                <a href="mailto:${email}"
                   style="display:inline-block;margin-top:16px;
                          background:#111827;color:#fff;
                          padding:12px 18px;border-radius:8px;
                          text-decoration:none;">
                  ✉️ Müşteriye Yanıtla
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}
