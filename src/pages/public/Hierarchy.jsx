import { useEffect, useState } from "react";
import { getAcademicYears, getCurrentYear } from "../../services/yearService";
import { getMembers } from "../../services/memberService";
import PageHeader from "../../components/ui/PageHeader";
import YearSelector from "../../components/ui/YearSelector";
import MemberCard from "../../components/ui/MemberCard";
import Reveal from "../../components/ui/Reveal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { ensureArray } from "../../utils/ensureArray";

export default function Hierarchy() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAcademicYears(), getCurrentYear()])
      .then(([allYears, current]) => {
        const list = ensureArray(allYears);
        setYears(list);
        setSelectedYear(current?.id ?? list[0]?.id ?? null);
      })
      .catch(() => {
        setYears([]);
      });
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    setLoading(true);
    getMembers(selectedYear)
      .then((data) => setMembers(ensureArray(data)))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [selectedYear]);

  return (
    <div className="dic-page">
      <div className="container-dic">
        <Reveal>
          <PageHeader
            eyebrow="Bureau"
            title="Les visages du club."
            subtitle="Composition de l'administration par annee academique."
          />
        </Reveal>

        <Reveal>
          <YearSelector
            years={years}
            selected={selectedYear}
            onChange={setSelectedYear}
          />
        </Reveal>

        {loading ? (
          <Loader />
        ) : members.length === 0 ? (
          <EmptyState message="Aucun membre enregistre pour cette annee." />
        ) : (
          <div className="dic-members-grid">
            {members.map((m, i) => (
              <Reveal key={m.id} delay={i * 50}>
                <MemberCard member={m} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}