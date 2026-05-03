type CalendarEvent = {
  startDate: Date;
  endDate: Date;
  summary?: string;
};

function parseIcsDate(value: string): Date {
  const cleanValue = value.trim();

  if (/^\d{8}$/.test(cleanValue)) {
    const year = Number(cleanValue.slice(0, 4));
    const month = Number(cleanValue.slice(4, 6)) - 1;
    const day = Number(cleanValue.slice(6, 8));
    return new Date(Date.UTC(year, month, day));
  }

  if (/^\d{8}T\d{6}Z$/.test(cleanValue)) {
    const year = Number(cleanValue.slice(0, 4));
    const month = Number(cleanValue.slice(4, 6)) - 1;
    const day = Number(cleanValue.slice(6, 8));
    const hour = Number(cleanValue.slice(9, 11));
    const minute = Number(cleanValue.slice(11, 13));
    const second = Number(cleanValue.slice(13, 15));
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }

  return new Date(cleanValue);
}

export function parseIcsEvents(icsText: string): CalendarEvent[] {
  const normalized = icsText.replace(/\r\n/g, "\n");
  const blocks = normalized.split("BEGIN:VEVENT").slice(1);

  const events: CalendarEvent[] = [];

  for (const block of blocks) {
    const endBlock = block.split("END:VEVENT")[0];

    const dtStartMatch = endBlock.match(
      /DTSTART(?:;VALUE=DATE)?(?::|;[^:]*:)(.+)/,
    );
    const dtEndMatch = endBlock.match(/DTEND(?:;VALUE=DATE)?(?::|;[^:]*:)(.+)/);
    const summaryMatch = endBlock.match(/SUMMARY:(.+)/);

    if (!dtStartMatch || !dtEndMatch) continue;

    const startDate = parseIcsDate(dtStartMatch[1]);
    const endDate = parseIcsDate(dtEndMatch[1]);
    const summary = summaryMatch?.[1]?.trim();

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      continue;
    }

    events.push({
      startDate,
      endDate,
      summary,
    });
  }

  return events;
}

export function normalizeDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);

  while (current < endDate) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}
