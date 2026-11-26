import RequestForm from "@/components/RequestForm";
import PageNav from "@/components/PageNav";
export default function Custom() {
  return (
    <div className="up">
      <h1 className="text-4xl md:text-6xl font-black neon text-center">المشاريع المدفوعة</h1>
      <p className="text-center opacity-70 mt-2 mb-10">اطلب بوتاً مخصصاً وسنتواصل معك على ديسكورد</p>
      <RequestForm /><PageNav path="/custom-project" />
    </div>
  );
}
