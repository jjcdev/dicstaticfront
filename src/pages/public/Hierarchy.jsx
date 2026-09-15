import { useEffect, useState } from "react";
import { getAcademicYears, getCurrentYear } from "../../services/yearService";
import { getMembers } from "../../services/memberService";
import YearSelector from "../../components/ui/YearSelector";
import MemberCard from "../../components/ui/MemberCard";
import PageHeader from "../../components/ui/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

export default function Hierarchy() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAcademicYears(), getCurrentYear()])
      .then(([allYears, current]) => {
        setYears(allYears);
        setSelectedYear(current?.id ?? allYears[0]?.id ?? null);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    setLoading(true);
    getMembers(selectedYear)
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [selectedYear]);

  return (
    <div className="container py-4 py-md-5">
      <PageHeader
        title="Bureau du club"
        subtitle="Composition de l'administration par annee academique."
      />

      <YearSelector
        years={years}
        selected={selectedYear}
        onChange={setSelectedYear}
      />

      {loading ? (
        <Loader />
      ) : members.length === 0 ? (
        <EmptyState message="Aucun membre enregistre pour cette annee." />
      ) : (
        <div className="row g-3 g-md-4">
          {members.map((m) => (
            <div className="col-6 col-md-4 col-lg-3" key={m.id}>
              <MemberCard member={m} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}