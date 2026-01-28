export type DoctorSlot = {
  date: string;
  startTime: string;
  endTime: string;
};

type SlotListProps = {
  slots: DoctorSlot[];
};

export function SlotList({ slots }: SlotListProps) {
  return (
    <div className="grid gap-2">
      {slots.map((slot, i) => (
        <div key={i} className="p-3 border rounded">
          <strong>{slot.date}</strong>
          <div>
            {slot.startTime} – {slot.endTime}
          </div>
        </div>
      ))}
    </div>
  );
}
