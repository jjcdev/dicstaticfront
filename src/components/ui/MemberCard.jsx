import { FaLinkedin, FaGithub } from "react-icons/fa";
import { resolveImage } from "../../utils/resolveImage";

export default function MemberCard({ member }) {
  const photo = resolveImage(member.photo_url) || "/default-avatar.png";

  return (
    <article className="dic-slide" style={{ width: "100%" }}>
      <div className="dic-slide-media dic-slide-media-square">
        <img src={photo} alt={`${member.first_name} ${member.last_name}`} />
      </div>
      <div className="dic-slide-body">
        <span className="dic-slide-badge">
          {member.academic_year?.label || "Membre"}
        </span>
        <h3 className="dic-slide-title">
          {member.first_name} {member.last_name}
        </h3>
        <p
          className="dic-slide-text"
          style={{ color: "var(--color-primary)", fontWeight: 600 }}
        >
          {member.role}
        </p>
        {member.bio && (
          <p className="dic-slide-text" style={{ marginTop: "0.5rem" }}>
            {member.bio}
          </p>
        )}

        {(member.linkedin || member.github) && (
          <div className="dic-slide-tags" style={{ marginTop: "0.85rem" }}>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="dic-member-social"
              >
                <FaLinkedin />
              </a>
            )}
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="dic-member-social"
              >
                <FaGithub />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}