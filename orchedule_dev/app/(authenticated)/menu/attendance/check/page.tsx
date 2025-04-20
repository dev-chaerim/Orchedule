import AttendanceForm from './AttendanceForm';
import MemberAttendanceList from './MemberAttendanceList';

export default function AttendanceCheckPage() {
  return (
    <div className="space-y-6">
      <AttendanceForm />
      <MemberAttendanceList />
    </div>
  );
}
