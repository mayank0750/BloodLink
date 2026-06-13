import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Droplet,
  Activity,
  Users,
  Navigation,
  Inbox,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import ContactSection from "../components/ContactSection";
import { PublicService } from "../services/PublicService";

const HomePage = () => {
  const [stats, setStats] = useState({
    bloodDonors: 0,
    organDonors: 0,
    citiesCovered: 0,
  });

  const [DonorReq, setDonorReq] = useState({
    totalRequests: 0,
  });

  useEffect(() => {
    loadDonorStats();
    loadDonorReqStats();
  }, []);

  const loadDonorStats = async () => {
    try {
      const response = await PublicService.GetDonorNumber();
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDonorReqStats = async () => {
    try {
      const response = await PublicService.GetDonorReqNumber();
      setDonorReq(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(200, 30, 30, 0.95) 0%, rgba(154, 21, 21, 0.95) 100%)",
          padding: "3rem 1rem",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.2)",
              padding: "0.5rem 1.5rem",
              borderRadius: "50px",
              marginBottom: "2rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              BE A HERO • CONNECTING DONORS • SAVING LIVES
            </span>
          </div>

          <h1
            style={{
              fontSize: "4rem",
              marginBottom: "1.5rem",
              fontFamily: "'DM Serif Display', serif",
              lineHeight: 1.1,
              background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Connecting Lives,
            <br />
            One Donation at a Time
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              marginBottom: "3rem",
              opacity: 0.95,
              maxWidth: "700px",
              margin: "0 auto 3rem",
            }}
          >
            WeLifeLink connects blood and organ donors with people in need.
            Register as a donor, request support, and help save lives across
            India.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/register"
              className="btn-primary"
              style={{
                background: "white",
                color: "var(--primary)",
                fontSize: "1.1rem",
                padding: "1rem 2.5rem",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              }}
            >
              Become a Donor
              <ArrowRight size={20} />
            </Link>

            <Link
              to="/organ-request"
              className="btn-secondary"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                color: "white",
                borderColor: "white",
                fontSize: "1.1rem",
                padding: "1rem 2.5rem",
                backdropFilter: "blur(10px)",
              }}
            >
              Request Organ
              <Heart size={20} />
            </Link>

            <Link
              to="/login"
              className="btn-secondary"
              style={{
                background: "transparent",
                color: "white",
                borderColor: "white",
                fontSize: "1.1rem",
                padding: "1rem 2.5rem",
              }}
            >
              Find Donors
              <Users size={20} />
            </Link>
          </div>
          <p
            style={{
              fontSize: "0.95rem",
              opacity: 0.9,
              marginTop: "1.5rem",
            }}
          >
            ❤️ Blood Donation • 🫀 Organ Support • 🤝 Direct Connections
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={{
          padding: "2rem 1rem",
          background: "var(--bg-card)",
          borderBottom: "2px solid  #c81e1e",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="stats-grid">
            <div className="stat-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(200, 30, 30, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                  }}
                >
                  <Droplet size={32} />
                </div>
                <div>
                  <div
                    className="stat-value"
                    style={{
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {stats.bloodDonors}
                  </div>
                  <div className="stat-label">Blood Donors</div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(30, 58, 138, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--secondary)",
                  }}
                >
                  <Heart size={32} />
                </div>
                <div>
                  <div
                    className="stat-value"
                    style={{
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {stats.organDonors}
                  </div>
                  <div className="stat-label">Organ Donors</div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(5, 150, 105, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--success)",
                  }}
                >
                  <Inbox size={32} />
                </div>
                <div>
                  <div
                    className="stat-value"
                    style={{
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {DonorReq.totalRequests}
                  </div>
                  <div className="stat-label">Donor Request</div>
                  {/* <div className="stat-value">50,000+</div>
                  <div className="stat-label">Lives Saved</div> */}
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(251, 191, 36, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                  }}
                >
                  <Navigation size={32} />
                </div>
                <div>
                  <div
                    className="stat-value"
                    style={{
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {stats.citiesCovered}
                  </div>
                  <div className="stat-label">Cities Covered</div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ color: "#c81e1e" }}>Live Impact Dashboard</h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Real-time statistics updated from our donor network and organ
              request system.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "2rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
              Why Choose WeLifeLink?
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              We make it simple, safe, and meaningful to donate blood and organs
            </p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  color: "white",
                }}
              >
                <CheckCircle size={40} />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                Verified Donors
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                All donors are verified with proper documentation and contact
                details for your safety and peace of mind.
              </p>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  color: "white",
                }}
              >
                <Activity size={40} />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                Quick Search
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                Find blood or organ donors instantly with advanced filters by
                blood group, location, and organ type.
              </p>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  color: "white",
                }}
              >
                <Heart size={40} />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                24/7 Available
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                Access our platform anytime, anywhere. Emergencies don't wait,
                and neither do we.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "2.5rem 1rem",
          background:
            "linear-gradient(135deg, rgba(200, 30, 30, 0.05) 0%, rgba(154, 21, 21, 0.05) 100%)",
          borderTop: "2px solid #c81e1e",
          borderBottom: "2px solid  #c81e1e",
        }}
      >
        <div
          style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}
        >
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>
            Ready to Make a Difference?
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--text-secondary)",
              marginBottom: "2.5rem",
            }}
          >
            Join thousands of heroes who are saving lives every day. Your
            donation can give someone a second chance at life.
          </p>
          <Link
            to="/register"
            className="btn-primary"
            style={{
              fontSize: "1.1rem",
              padding: "1.25rem 3rem",
            }}
          >
            Register as a Donor Today
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <ContactSection />
    </div>
  );
};

export default HomePage;
